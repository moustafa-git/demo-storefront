"use client"
import React, { useState, useEffect, useRef } from "react"
import AvatarViewer from "./index"
import { Button, Tooltip, TooltipProvider } from "@medusajs/ui"
import { XMarkIcon, QuestionMarkCircleIcon, ArrowsPointingOutIcon } from "@heroicons/react/24/outline"
import { motion, AnimatePresence } from "framer-motion"
import type { MaterialValue } from "../../templates/product-page-client"

// Animation variants for modal
const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.2 }
  },
  exit: { opacity: 0, transition: { duration: 0.2 } }
} as const;

const modalVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { 
      type: "spring" as const, 
      damping: 25, 
      stiffness: 300 
    } 
  },
  exit: { 
    y: 50, 
    opacity: 0,
    transition: { duration: 0.2 }
  }
} as const;

interface AvatarModalProps {
  isOpen: boolean
  onClose: () => void
  materialValues: Record<string, MaterialValue>
  onMaterialsLoaded?: (materials: string[]) => void
  skinnedModelUrl?: string
}

const AvatarModal: React.FC<AvatarModalProps> = ({
  isOpen,
  onClose,
  materialValues,
  onMaterialsLoaded,
  skinnedModelUrl,
}) => {
  const [showHelp, setShowHelp] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Set initial help state
  useEffect(() => {
    setShowHelp(true);
  }, []);

  // Reset loading state when modal opens/closes or model changes
  useEffect(() => {
    if (isOpen && skinnedModelUrl) {
      setIsLoading(true);
    }
  }, [isOpen, skinnedModelUrl]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
      if (e.key === 'f' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggleFullscreen();
      }
      if (e.key === 'h') {
        setShowHelp(prev => !prev);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Focus the modal when opened for better keyboard navigation
      modalRef.current?.focus();
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(console.error);
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(console.error);
        setIsFullscreen(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <TooltipProvider>
      <AnimatePresence>
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={backdropVariants}
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
        {/* Backdrop with blur */}
        <motion.div 
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
          aria-hidden="true"
        />
        
        {/* Modal Content */}
        <motion.div 
          ref={modalRef}
          className={`relative bg-white rounded-xl shadow-2xl ${isFullscreen ? 'w-full h-full max-w-none m-0 rounded-none' : 'w-full max-w-[800px] max-h-[90vh] mx-6'}`}
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          tabIndex={-1}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <h2 id="modal-title" className="text-lg font-semibold text-gray-900">
                Try on Avatar
              </h2>
              <Tooltip 
                content={
                  <div className="p-2 max-w-xs">
                    <p className="text-sm">
                      Drag to rotate • Scroll to zoom • Right-click drag to pan
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Press H to show/hide help • ESC to close
                    </p>
                  </div>
                }
              >
                <button 
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                  aria-label="Help"
                  onClick={() => setShowHelp(!showHelp)}
                >
                  <QuestionMarkCircleIcon className="h-5 w-5" />
                </button>
              </Tooltip>
            </div>
            
            <div className="flex items-center space-x-2">
              <Tooltip content={isFullscreen ? 'Exit fullscreen (Ctrl+F)' : 'Enter fullscreen (Ctrl+F)'}>
                <button
                  onClick={toggleFullscreen}
                  className="p-1.5 text-gray-500 hover:text-gray-700 transition-colors rounded-full hover:bg-gray-100"
                  aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                >
                  <ArrowsPointingOutIcon className="h-5 w-5" />
                </button>
              </Tooltip>
              <button
                onClick={onClose}
                className="p-1.5 text-gray-500 hover:text-gray-700 transition-colors rounded-full hover:bg-gray-100"
                aria-label="Close modal"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          {/* Help Panel */}
          <AnimatePresence>
            {showHelp && (
              <motion.div 
                className="bg-blue-50 border-b border-blue-100 px-4 py-3 text-sm text-blue-800"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="container mx-auto flex flex-wrap items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">How to use:</p>
                    <ul className="list-disc list-inside text-xs space-y-1 mt-1">
                      <li>Drag to rotate the view</li>
                      <li>Scroll to zoom in/out</li>
                      <li>Right-click and drag to pan</li>
                    </ul>
                  </div>
                  <button 
                    onClick={() => setShowHelp(false)}
                    className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                  >
                    Got it!
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Avatar Viewer */}
          <div className="relative" style={{ height: isFullscreen ? 'calc(100vh - 120px)' : '400px' }}>
            {skinnedModelUrl ? (
              <>
                <AvatarViewer
                  avatarModelUrl="https://erqnhajcjxbkwpijagez.supabase.co/storage/v1/object/public/spaceaids-uploads/Skinned%203D%20Models/avatar.glb"
                  productModelUrl={skinnedModelUrl}
                  materialValues={materialValues}
                  onMaterialsLoaded={() => setIsLoading(false)}
                  style={{ height: '100%' }}
                />
                
                {/* Loading overlay */}
                {isLoading && (
                  <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-8 h-8 border-2 border-ui-border-strong border-t-ui-fg-interactive rounded-full animate-spin mx-auto mb-3"></div>
                      <p className="text-ui-fg-subtle text-sm">Loading your avatar...</p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg">
                <div className="text-center p-6 max-w-md">
                  <div className="text-6xl mb-4">👕</div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Avatar Try-On Not Available</h3>
                  <p className="text-gray-500 text-sm">
                    This product doesn't support the avatar try-on feature. Please check back later or contact support for more information.
                  </p>
                </div>
              </div>
            )}
          </div>
          
          {/* Footer with controls */}
          <div className="flex items-center justify-between p-3 border-t border-gray-200 bg-gray-50">
            <div className="text-xs text-gray-500">
              Press <kbd className="px-2 py-1 bg-gray-200 rounded-md">H</kbd> for help
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="secondary"
                onClick={onClose}
                className="px-6"
              >
                Close (ESC)
              </Button>
            </div>
          </div>
        </motion.div>
        

        </motion.div>
      </AnimatePresence>
    </TooltipProvider>
  );
};

export default React.memo(AvatarModal);