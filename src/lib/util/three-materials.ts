import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';

/**
 * Loads a GLTF/GLB model from a URL and extracts all unique material names.
 * @param url The URL to the GLTF/GLB file
 * @returns Promise<string[]> - Array of unique material names
 */
export async function extractMaterialNamesFromGLTF(url: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(
      url,
      (gltf) => {
        // Normalize names similar to runtime so gating matches the viewer
        const usage = new Map<string, number>();
        gltf.scene.traverse((obj: any) => {
          if (!obj.isMesh || !obj.material) return;
          const countMat = (mat: any) => {
            if (!mat) return;
            const id = mat.uuid;
            usage.set(id, (usage.get(id) || 0) + 1);
          };
        
          if (Array.isArray(obj.material)) obj.material.forEach(countMat);
          else countMat(obj.material);
        });

        const materialNames = new Set<string>();
        const deriveName = (meshName?: string) => `${meshName && meshName !== '' ? meshName : 'Mesh'}_Material`;
        gltf.scene.traverse((obj: any) => {
          if (!obj.isMesh || !obj.material) return;

          const pushName = (mat: any) => {
            if (!mat) return;
            const isUnnamed = !mat.name || mat.name === 'None' || mat.name.startsWith('None');
            const isShared = (usage.get(mat.uuid) || 0) > 1;
            if (isUnnamed || isShared) {
              materialNames.add(deriveName(obj.name));
            } else {
              materialNames.add(mat.name);
            }
          };

          if (Array.isArray(obj.material)) obj.material.forEach(pushName);
          else pushName(obj.material);
        });
        // Clean up
        gltf.scene.traverse((obj: any) => {
          if (obj.isMesh) {
            obj.geometry?.dispose?.();
            if (Array.isArray(obj.material)) {
              obj.material.forEach((mat: any) => mat?.dispose?.());
            } else {
              obj.material?.dispose?.();
            }
          }
        });
        resolve(Array.from(materialNames));
      },
      undefined,
      (error) => {
        reject(error);
      }
    );
  });
} 