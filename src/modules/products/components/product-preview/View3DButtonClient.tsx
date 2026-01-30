"use client";
import { Button } from "../../../common/components/button";

const View3DButtonClient = ({ handle, productId }: { handle: string, productId: string }) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    let skinToneParam = '';
    try {
      const sessionKey = `skin_tone_selection_virtual_skin_tone_${productId}`;
      const sessionData = sessionStorage.getItem(sessionKey);
      if (sessionData) {
        const parsed = JSON.parse(sessionData);
        if (parsed.skinToneId) {
          skinToneParam = `&skintone=${encodeURIComponent(parsed.skinToneId)}`;
        }
      }
    } catch {}
    window.location.href = `/products/${handle}?view3d=1${skinToneParam}`;
  };
  return (
    <Button
      variant="primary"
      size="sm"
      className="transition-opacity"
      onClick={handleClick}
    >
      View in 3D
    </Button>
  );
};

export default View3DButtonClient; 