"use client"

import React, { useEffect, useActionState, useState, useRef } from "react"
import { Button, Heading } from "@medusajs/ui"
import { Camera } from "@medusajs/icons"

import AccountInfo from "../account-info"
import Modal from "@modules/common/components/modal"
import useToggleState from "@lib/hooks/use-toggle-state"
import { HttpTypes } from "@medusajs/types"
import { updateCustomer } from "@lib/data/customer"
import {
  SKIN_TONE_OPTIONS,
  analyzeSkinTone,
  getSkinToneById,
  type SkinToneResult,
} from "@lib/util/skin-tone-analyzer"

import {
  Camera as Cam,
  CameraResultType,
  CameraSource,
} from "@capacitor/camera"
import { Capacitor } from "@capacitor/core"

type SkinToneProps = {
  customer: HttpTypes.StoreCustomer
}

const ProfileSkinTone: React.FC<SkinToneProps> = ({ customer }) => {
  const [successState, setSuccessState] = useState(false)
  const [selectedSkinTone, setSelectedSkinTone] = useState(
    (customer.metadata?.skin_tone as string) || ""
  )
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [filter, setFilter] = useState<
    "all" | "fitzpatrick" | "regional" | "foundation"
  >("all")
  const [customSkinColor, setCustomSkinColor] = useState<string | null>(null)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const {
    state: isCameraOpen,
    open: openCamera,
    close: closeCamera,
  } = useToggleState(false)
  const {
    state: isUploadOpen,
    open: openUpload,
    close: closeUpload,
  } = useToggleState(false)
  const {
    state: isManualOpen,
    open: openManual,
    close: closeManual,
  } = useToggleState(false)

  const updateSkinTone = async (
    _currentState: Record<string, unknown>,
    formData: FormData
  ) => {
    const skinTone = formData.get("skin_tone") as string

    try {
      // Prepare metadata update
      const metadataUpdate: any = {
        ...customer.metadata,
        skin_tone: skinTone,
      }

      // If it's a custom skin tone and we have a custom color, store it
      if (skinTone === "custom" && customSkinColor) {
        metadataUpdate.custom_skin_color = customSkinColor
      } else if (skinTone !== "custom") {
        // Clear custom color if not using custom skin tone
        metadataUpdate.custom_skin_color = null
      }

      await updateCustomer({
        metadata: metadataUpdate,
      })
      setSelectedSkinTone(skinTone)
      // Clear sessionStorage for the virtual skin tone selector so product page reflects new profile value
      try {
        // Remove generic key (old)
        const legacyKey = `skin_tone_selection_virtual_skin_tone`
        sessionStorage.removeItem(legacyKey)
        // Remove all per-product keys (new)
        const keyPrefix = 'skin_tone_selection_virtual_skin_tone_'
        for (let i = 0; i < sessionStorage.length; i++) {
          const k = sessionStorage.key(i)
          if (k && k.startsWith(keyPrefix)) {
            sessionStorage.removeItem(k)
            // Adjust index due to removal
            i--
          }
        }
      } catch (e) {
        // Ignore errors
      }
      return { success: true, error: null }
    } catch (error: any) {
      return { success: false, error: error.toString() }
    }
  }

  const [state, formAction] = useActionState(updateSkinTone, {
    error: false,
    success: false,
  })

  const clearState = () => {
    setSuccessState(false)
  }

  // Request only camera access
  const requestCameraPermission = async () => {
    const status = await Cam.requestPermissions({ permissions: ["camera"] })
    console.log("Camera permission status:", status)
  }

  // Request only gallery/photos access
  const requestPhotoPermission = async () => {
    const status = await Cam.requestPermissions({ permissions: ["photos"] })
    console.log("Photos permission status:", status)
  }

  useEffect(() => {
    setSuccessState(state.success)
  }, [state])

  // Initialize custom skin color from customer metadata
  useEffect(() => {
    if (
      customer?.metadata?.custom_skin_color &&
      customer?.metadata?.skin_tone === "custom"
    ) {
      setCustomSkinColor(customer.metadata.custom_skin_color as string)
    }
  }, [customer?.metadata?.custom_skin_color, customer?.metadata?.skin_tone])

  // Camera functionality
  const startCamera = async () => {
    try {
      setCameraError(null)
      // Use Capacitor Camera on native platforms; keep getUserMedia for web
      if (Capacitor.isNativePlatform()) {
        try {
          await Cam.requestPermissions({ permissions: ["camera"] })
        } catch (e) {
          // ignore; getPhoto will still prompt if needed
        }
        const photo = await Cam.getPhoto({
          resultType: CameraResultType.DataUrl,
          source: CameraSource.Camera,
          quality: 85,
          allowEditing: false,
        })
        const imageData = photo?.dataUrl
        if (imageData) {
          setCapturedImage(imageData)
          analyzeSkinToneFromImage(imageData)
        }
        return
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
      setCameraError(
        "Camera access denied. Please allow camera permissions and try again."
      )
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
  }

  // Start camera when modal opens
  // useEffect(() => {
  //   if (isCameraOpen) {
  //     startCamera()
  //   } else {
  //     stopCamera()
  //     setCameraError(null)
  //     setCapturedImage(null)
  //   }
  // }, [isCameraOpen])

  useEffect(() => {
    if (isCameraOpen) {
      requestCameraPermission()
        .then(() => startCamera())
        .catch((err) => console.error("Permission failed:", err))
    } else {
      stopCamera()
      setCameraError(null)
      setCapturedImage(null)
    }
  }, [isCameraOpen])

  useEffect(() => {
    if (isUploadOpen) {
      requestPhotoPermission().catch((err) =>
        console.error("Photo permission error:", err)
      )
    }
  }, [isUploadOpen])

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d")
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth
        canvasRef.current.height = videoRef.current.videoHeight
        context.drawImage(videoRef.current, 0, 0)

        const imageData = canvasRef.current.toDataURL("image/jpeg")
        setCapturedImage(imageData)
        analyzeSkinToneFromImage(imageData)

        // Scroll to show the captured image
        setTimeout(() => {
          const modalBody = document.querySelector(
            '[data-testid="camera-modal-body"]'
          )
          if (modalBody) {
            modalBody.scrollTop = modalBody.scrollHeight
          }
        }, 100)
      }
    }
  }

  const analyzeSkinToneFromImage = async (imageData: string) => {
    setIsAnalyzing(true)

    try {
      const result: SkinToneResult = await analyzeSkinTone(imageData)
      setSelectedSkinTone(result.skinToneId)

      // Store custom color if it's a custom skin tone
      if (result.skinToneId === "custom" && result.customColor) {
        setCustomSkinColor(result.customColor)
      } else {
        setCustomSkinColor(null)
      }
    } catch (error) {
      console.error("Skin tone analysis failed:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageData = e.target?.result as string
        setCapturedImage(imageData)
        analyzeSkinToneFromImage(imageData)

        // Scroll to show the uploaded image
        setTimeout(() => {
          const modalBody = document.querySelector(
            '[data-testid="upload-modal-body"]'
          )
          if (modalBody) {
            modalBody.scrollTop = modalBody.scrollHeight
          }
        }, 100)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleManualSelection = (skinToneId: string) => {
    setSelectedSkinTone(skinToneId)
  }

  const getCurrentSkinToneInfo = () => {
    if (selectedSkinTone === "custom") {
      // Return custom skin tone info
      return {
        id: "custom",
        name: "Custom Skin Tone",
        color: customSkinColor || "#D4A67C", // Use actual captured color
        description: "Your unique skin tone",
        undertone: "neutral" as const,
      }
    }
    return getSkinToneById(selectedSkinTone)
  }

  const currentTone = getCurrentSkinToneInfo()

  return (
    <form action={formAction} className="w-full overflow-visible">
      <AccountInfo
        label="Skin Tone"
        currentInfo={
          currentTone ? (
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded-full border border-gray-300"
                style={{ backgroundColor: currentTone.color }}
              />
              <span>{currentTone.name}</span>
            </div>
          ) : (
            <span className="text-gray-500">Not set</span>
          )
        }
        isSuccess={successState}
        isError={!!state?.error}
        clearState={clearState}
        data-testid="account-skin-tone-editor"
      >
        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={openCamera}
              className="flex items-center gap-2"
            >
              <Camera />
              Take Photo
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={openUpload}
              className="flex items-center gap-2"
            >
              📁 Upload Photo
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={openManual}
              className="flex items-center gap-2"
            >
              🎨 Choose Manually
            </Button>
          </div>

          {selectedSkinTone && (
            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded">
              <div
                className="w-8 h-8 rounded-full border border-gray-300"
                style={{ backgroundColor: currentTone?.color }}
              />
              <div>
                <div className="font-medium">{currentTone?.name}</div>
                <div className="text-sm text-gray-600">
                  {currentTone?.description}
                </div>
              </div>
            </div>
          )}

          <input type="hidden" name="skin_tone" value={selectedSkinTone} />
        </div>
      </AccountInfo>

      {/* Camera Modal */}
      <Modal isOpen={isCameraOpen} close={closeCamera} size="large">
        <Modal.Title>
          <Heading className="mb-2">📸 Capture Your Skin Tone</Heading>
        </Modal.Title>
        <Modal.Body>
          <div
            className="flex flex-col gap-6 max-h-[60vh] overflow-y-auto pr-2"
            data-testid="camera-modal-body"
          >
            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="text-blue-600 text-lg">💡</div>
                <div>
                  <h3 className="text-sm font-medium text-blue-900 mb-1">
                    Tips for best results:
                  </h3>
                  <ul className="text-xs text-blue-800 space-y-1">
                    <li>
                      • Position your arm, face, or neck in natural lighting
                    </li>
                    <li>• Avoid shadows and harsh artificial light</li>
                    <li>• Keep the camera steady and close to your skin</li>
                    <li>
                      • Make sure your skin is clearly visible in the frame
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Camera Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-900">
                  Camera Preview
                </h3>
                {!cameraError && !capturedImage && (
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    Live camera
                  </div>
                )}
              </div>

              <div className="relative bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 overflow-hidden">
                {cameraError ? (
                  <div className="w-full h-80 bg-gray-50 flex items-center justify-center">
                    <div className="text-center p-6">
                      <div className="text-red-500 text-4xl mb-3">📷</div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">
                        Camera Access Required
                      </h4>
                      <p className="text-xs text-gray-600 mb-4 max-w-sm">
                        {cameraError}
                      </p>
                      <button
                        type="button"
                        onClick={startCamera}
                        className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Allow Camera Access
                      </button>
                    </div>
                  </div>
                ) : (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-80 object-cover"
                  />
                )}
                <canvas ref={canvasRef} className="hidden" />
              </div>
            </div>

            {/* Captured Image Section */}
            {capturedImage && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900">
                    Captured Photo
                  </h3>
                  <button
                    type="button"
                    onClick={() => setCapturedImage(null)}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    Retake photo
                  </button>
                </div>

                <div className="relative bg-gray-50 rounded-xl border-2 border-gray-200 overflow-hidden">
                  <img
                    src={capturedImage}
                    alt="Captured skin"
                    className="w-full h-80 object-cover"
                  />
                  {isAnalyzing && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <div className="bg-white rounded-lg p-4 flex items-center gap-3">
                        <div className="animate-spin w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                        <span className="text-sm font-medium">
                          Analyzing skin tone...
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex gap-3 w-full">
            <Button
              variant="secondary"
              onClick={closeCamera}
              className="flex-1"
            >
              Cancel
            </Button>
            {!capturedImage ? (
              <Button
                onClick={capturePhoto}
                disabled={!!cameraError}
                className="flex-1"
              >
                📸 Capture Photo
              </Button>
            ) : (
              <Button onClick={() => closeCamera()} className="flex-1">
                ✅ Use This Photo
              </Button>
            )}
          </div>
        </Modal.Footer>
      </Modal>

      {/* Upload Modal */}
      <Modal isOpen={isUploadOpen} close={closeUpload} size="large">
        <Modal.Title>
          <Heading className="mb-2">📁 Upload Skin Photo</Heading>
        </Modal.Title>
        <Modal.Body>
          <div
            className="flex flex-col gap-6 max-h-[60vh] overflow-y-auto pr-2"
            data-testid="upload-modal-body"
          >
            {/* Instructions */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="text-green-600 text-lg">📋</div>
                <div>
                  <h3 className="text-sm font-medium text-green-900 mb-1">
                    Photo Requirements:
                  </h3>
                  <ul className="text-xs text-green-800 space-y-1">
                    <li>• Clear, well-lit photo of your skin</li>
                    <li>• Natural lighting (avoid flash)</li>
                    <li>• Close-up of arm, face, or neck</li>
                    <li>• Supported formats: JPG, PNG, WebP</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Upload Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-900">
                Select Photo
              </h3>

              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 bg-gray-50">
                <div className="text-center">
                  <div className="text-gray-400 text-4xl mb-3">📁</div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">
                    Choose a photo
                  </h4>
                  <p className="text-xs text-gray-600 mb-4">
                    Select a clear photo of your skin for analysis
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="skin-tone-upload"
                  />
                  <label
                    htmlFor="skin-tone-upload"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                  >
                    📁 Browse Files
                  </label>
                </div>
              </div>
            </div>

            {/* Uploaded Image Section */}
            {capturedImage && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900">
                    Uploaded Photo
                  </h3>
                  <button
                    type="button"
                    onClick={() => setCapturedImage(null)}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    Choose different photo
                  </button>
                </div>

                <div className="relative bg-gray-50 rounded-xl border-2 border-gray-200 overflow-hidden">
                  <img
                    src={capturedImage}
                    alt="Uploaded skin"
                    className="w-full h-80 object-cover"
                  />
                  {isAnalyzing && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <div className="bg-white rounded-lg p-4 flex items-center gap-3">
                        <div className="animate-spin w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                        <span className="text-sm font-medium">
                          Analyzing skin tone...
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex gap-3 w-full">
            <Button
              variant="secondary"
              onClick={closeUpload}
              className="flex-1"
            >
              Cancel
            </Button>
            {capturedImage && (
              <Button onClick={() => closeUpload()} className="flex-1">
                ✅ Use This Photo
              </Button>
            )}
          </div>
        </Modal.Footer>
      </Modal>

      {/* Manual Selection Modal */}
      <Modal isOpen={isManualOpen} close={closeManual} size="large">
        <Modal.Title>
          <Heading className="mb-2">🎨 Choose Your Skin Tone</Heading>
        </Modal.Title>
        <Modal.Body>
          <div className="flex flex-col gap-6 max-h-[60vh] overflow-y-auto pr-2">
            {/* Instructions */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="text-purple-600 text-lg">🎯</div>
                <div>
                  <h3 className="text-sm font-medium text-purple-900 mb-1">
                    How to choose:
                  </h3>
                  <ul className="text-xs text-purple-800 space-y-1">
                    <li>• Look at your natural skin color in good lighting</li>
                    <li>• Consider your undertone (warm, cool, or neutral)</li>
                    <li>
                      • Choose the option that most closely matches your skin
                    </li>
                    <li>• You can always change this later in your profile</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Skin Tone Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-900">
                  Select Your Skin Tone
                </h3>
                <div className="text-xs text-gray-500">
                  {SKIN_TONE_OPTIONS.length} options available
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                <button
                  type="button"
                  onClick={() => setFilter("all")}
                  className={`px-3 py-1 text-xs rounded-full whitespace-nowrap ${
                    filter === "all"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  All ({SKIN_TONE_OPTIONS.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilter("fitzpatrick")}
                  className={`px-3 py-1 text-xs rounded-full whitespace-nowrap ${
                    filter === "fitzpatrick"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Fitzpatrick Scale
                </button>
                <button
                  type="button"
                  onClick={() => setFilter("regional")}
                  className={`px-3 py-1 text-xs rounded-full whitespace-nowrap ${
                    filter === "regional"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Regional
                </button>
                <button
                  type="button"
                  onClick={() => setFilter("foundation")}
                  className={`px-3 py-1 text-xs rounded-full whitespace-nowrap ${
                    filter === "foundation"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Foundation Shades
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                {SKIN_TONE_OPTIONS.filter((tone) => {
                  if (filter === "all") return true
                  if (filter === "fitzpatrick")
                    return tone.id.includes("fitzpatrick")
                  if (filter === "regional")
                    return (
                      tone.id.includes("nordic") ||
                      tone.id.includes("celtic") ||
                      tone.id.includes("mediterranean") ||
                      tone.id.includes("asian") ||
                      tone.id.includes("african") ||
                      tone.id.includes("melanesian")
                    )
                  if (filter === "foundation")
                    return tone.id.includes("foundation")
                  return true
                }).map((tone) => (
                  <button
                    key={tone.id}
                    type="button"
                    onClick={() => handleManualSelection(tone.id)}
                    className={`p-3 border-2 rounded-lg text-left transition-all duration-200 ${
                      selectedSkinTone === tone.id
                        ? "border-blue-500 bg-blue-50 shadow-md"
                        : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full border-2 border-gray-300 shadow-sm flex-shrink-0"
                        style={{ backgroundColor: tone.color }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 text-sm truncate">
                          {tone.name}
                        </div>
                        <div className="text-xs text-gray-600 truncate">
                          {tone.description}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {tone.undertone}
                        </div>
                      </div>
                      {selectedSkinTone === tone.id && (
                        <div className="text-blue-600 text-lg flex-shrink-0">
                          ✓
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Preview */}
            {selectedSkinTone && (
              <div className="bg-gray-50 rounded-lg p-4 border">
                <h4 className="text-sm font-medium text-gray-900 mb-3">
                  Selected Skin Tone
                </h4>
                <div className="flex items-center gap-4">
                  <div
                    className="w-16 h-16 rounded-full border-2 border-gray-300 shadow-sm"
                    style={{
                      backgroundColor: getSkinToneById(selectedSkinTone)?.color,
                    }}
                  />
                  <div>
                    <div className="font-medium text-gray-900">
                      {getSkinToneById(selectedSkinTone)?.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {getSkinToneById(selectedSkinTone)?.description}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex gap-3 w-full">
            <Button
              variant="secondary"
              onClick={closeManual}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button onClick={() => closeManual()} className="flex-1">
              ✅ Confirm Selection
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </form>
  )
}

export default ProfileSkinTone
