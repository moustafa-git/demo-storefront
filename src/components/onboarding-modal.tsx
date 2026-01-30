"use client"

import React, { useState, useEffect, useRef } from "react"
import { Button } from "@medusajs/ui"
import { Camera, CheckCircle, ArrowRight, ArrowLeft } from "@medusajs/icons"
import Modal from "@modules/common/components/modal"
import useToggleState from "@lib/hooks/use-toggle-state"
import {
  SKIN_TONE_OPTIONS,
  analyzeSkinTone,
  getSkinToneById,
  type SkinToneResult,
} from "@lib/util/skin-tone-analyzer"
import { updateCustomer } from "@lib/data/customer"
import { HttpTypes } from "@medusajs/types"
import {
  Camera as Cam,
  CameraResultType,
  CameraSource,
} from "@capacitor/camera"
import { Capacitor } from "@capacitor/core"

interface OnboardingModalProps {
  customer: HttpTypes.StoreCustomer
  isOpen: boolean
  onComplete: () => void
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({
  customer,
  isOpen,
  onComplete,
}) => {
  // State Management
  const [currentStep, setCurrentStep] = useState<number>(1)
  const [selectedSkinTone, setSelectedSkinTone] = useState(
    (customer.metadata?.skin_tone as string) || ""
  )
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [customSkinColor, setCustomSkinColor] = useState<string | null>(null)
  const [filter, setFilter] = useState<
    "all" | "fitzpatrick" | "regional" | "foundation"
  >("all")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)

  // Refs
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // Modals
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

  // --- Logic Helpers ---

  const startCamera = async () => {
    try {
      setCameraError(null)
      if (Capacitor.isNativePlatform()) {
        try {
          await Cam.requestPermissions({ permissions: ["camera"] })
        } catch (e) { /* ignore */ }
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
      setCameraError("Camera access denied. Please check permissions.")
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
  }

  useEffect(() => {
    if (isCameraOpen) startCamera()
    else {
      stopCamera()
      setCameraError(null)
      setCapturedImage(null)
    }
  }, [isCameraOpen])

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
        closeCamera()
      }
    }
  }

  const analyzeSkinToneFromImage = async (imageData: string) => {
    setIsAnalyzing(true)
    try {
      const result: SkinToneResult = await analyzeSkinTone(imageData)
      setSelectedSkinTone(result.skinToneId)
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
      }
      reader.readAsDataURL(file)
    }
  }

  const handleManualSelection = (skinToneId: string) => {
    setSelectedSkinTone(skinToneId)
    closeManual()
  }

  const handleComplete = async () => {
    if (!selectedSkinTone) return
    setIsSubmitting(true)
    try {
      const metadataUpdate: any = {
        ...customer.metadata,
        skin_tone: selectedSkinTone,
        profile_completed: true,
      }
      if (selectedSkinTone === "custom" && customSkinColor) {
        metadataUpdate.custom_skin_color = customSkinColor
      } else if (selectedSkinTone !== "custom") {
        metadataUpdate.custom_skin_color = null
      }
      await updateCustomer({ metadata: metadataUpdate })
      try {
             // Clear legacy session storage if exists
             const legacyKey = `skin_tone_selection_virtual_skin_tone`
             sessionStorage.removeItem(legacyKey)
             const keyPrefix = "skin_tone_selection_virtual_skin_tone_"
             for (let i = 0; i < sessionStorage.length; i++) {
               const k = sessionStorage.key(i)
               if (k && k.startsWith(keyPrefix)) {
                 sessionStorage.removeItem(k)
                 i--
               }
             }
      } catch (e) {}
      onComplete()
    } catch (error) {
      console.error("Failed to save skin tone:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getCurrentSkinToneInfo = () => {
    if (selectedSkinTone === "custom") {
      return {
        id: "custom",
        name: "Custom Skin Tone",
        color: customSkinColor || "#D4A67C",
        description: "Your unique skin tone",
        undertone: "neutral" as const,
      }
    }
    return getSkinToneById(selectedSkinTone)
  }

  const currentTone = getCurrentSkinToneInfo()

  // --- Render ---

  return (
    <Modal isOpen={isOpen} close={() => {}} size="large">
      <div className="flex flex-col min-h-[500px] max-h-[85vh] w-full max-w-2xl mx-auto bg-white overflow-hidden">
        
        {/* Minimal Header */}
        <div className="flex justify-between items-center px-8 py-6 border-b border-gray-50/50">
           <div className="flex gap-2 items-center">
             <span className="text-[10px] uppercase tracking-[0.25em] font-extrabold text-gray-400">
               Onboarding
             </span>
             <span className="text-gray-200">|</span>
             <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-gray-900">
               Step {currentStep} of 2
             </span>
           </div>
           {/* Steps Progress */}
           <div className="flex gap-1.5">
             <div className={`h-1.5 w-8 rounded-full transition-colors duration-500 ${currentStep >= 1 ? 'bg-black' : 'bg-gray-100'}`} />
             <div className={`h-1.5 w-8 rounded-full transition-colors duration-500 ${currentStep >= 2 ? 'bg-black' : 'bg-gray-100'}`} />
           </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-hidden relative">
          
          {/* STEP 1: WELCOME / VALUE PROP */}
          {currentStep === 1 && (
            <div className="h-full flex flex-col items-center justify-center p-4 animate-in fade-in slide-in-from-bottom-8 duration-700 overflow-hidden">
               
               {/* Hero Visual */}
               <div className="mb-5 relative group">
                  <div className="absolute inset-0 bg-indigo-500/10 blur-3xl rounded-full scale-150 group-hover:bg-indigo-500/15 transition-all duration-1000" />
                  <div className="relative w-24 h-24 bg-gradient-to-tr from-white to-gray-50 rounded-[2rem] shadow-2xl flex items-center justify-center border border-white/50">
                    <span className="text-4xl filter drop-shadow-sm select-none">✨</span>
                  </div>
               </div>

               {/* Typography */}
               <div className="text-center space-y-2 max-w-md mx-auto mb-6">
                 <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight leading-[1.1]">
                   Find Your <br/>
                   <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-500">Perfect Match</span>
                 </h1>
                 <p className="text-base text-gray-500 font-medium leading-relaxed">
                   Our AI analyzes your unique skin tone to recommend clothing that enhances your natural glow.
                 </p>
               </div>

               {/* Action */}
               <Button
                 onClick={() => setCurrentStep(2)}
                 className="group bg-black hover:bg-gray-900 text-white px-8 py-5 rounded-full font-bold text-base shadow-xl shadow-gray-200/50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 active:scale-95 flex items-center gap-2"
               >
                 Get Started
                 <ArrowRight className="group-hover:translate-x-1 transition-transform" />
               </Button>
            </div>
          )}

          {/* STEP 2: SELECTION & RESULT */}
          {currentStep === 2 && (
             <div className="h-full flex flex-col p-6 animate-in fade-in slide-in-from-right-8 duration-500">
               
               {/* Back Action */}
               <div className="flex-shrink-0">
                  <button 
                     onClick={() => setCurrentStep(1)}
                     className="mb-4 flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-black transition-colors w-fit group"
                  >
                     <ArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                     BACK
                  </button>
               </div>

               {/* Headline */}
               <div className="mb-6 text-center flex-shrink-0">
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-1">
                    Sync Your Profile
                  </h2>
                  <p className="text-sm text-gray-500 font-medium">Select a method to identify your skin tone</p>
               </div>

               {/* RESULT HERO CARD */}
               {selectedSkinTone ? (
                  <div className="flex-1 flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-500 min-h-0">
                     <div className="bg-white border border-gray-100 rounded-[2rem] p-5 shadow-2xl shadow-gray-200/50 w-full max-w-[300px] relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-green-400 to-emerald-500" />
                        
                        <div className="flex flex-col items-center text-center gap-3">
                           <div className="relative">
                              <div 
                                className="w-14 h-14 rounded-full border-[4px] border-white shadow-lg transition-transform duration-700 group-hover:scale-105"
                                style={{ backgroundColor: currentTone?.color }} 
                              />
                              <div className="absolute bottom-0 right-0 bg-white p-0.5 rounded-full shadow-md">
                                 <CheckCircle className="text-green-500 w-4 h-4" />
                              </div>
                           </div>
                           
                           <div className="space-y-0.5">
                              <span className="text-[9px] font-black tracking-widest text-green-600 uppercase">
                                 Verified Match
                              </span>
                              <h3 className="text-lg font-black text-gray-900">
                                 {currentTone?.name}
                              </h3>
                              <p className="text-[10px] text-gray-500 italic max-w-[180px] mx-auto hidden sm:block">
                                 "{currentTone?.description}"
                              </p>
                           </div>

                           <div className="pt-1 w-full">
                              <Button
                                 onClick={handleComplete}
                                 disabled={isSubmitting}
                                 className="w-full bg-black hover:bg-gray-900 text-white py-3 rounded-lg font-bold text-xs shadow-md transition-all active:scale-95"
                              >
                                 {isSubmitting ? "Saving..." : "Confirm & Continue"}
                              </Button>
                           </div>
                           
                           <button 
                             onClick={() => setSelectedSkinTone("")}
                             className="text-[9px] text-gray-400 font-bold hover:text-black transition-colors"
                           >
                              Choose Different Method
                           </button>
                        </div>
                     </div>
                  </div>
               ) : (
                  /* SELECTION GRID */
                  <div className="flex-1 flex items-center justify-center min-h-0">
                     <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto w-full">
                        {[
                          { id: 'camera', title: 'Camera', sub: 'Instant Analysis', icon: <Camera className="w-5 h-5"/>, action: openCamera },
                          { id: 'upload', title: 'Upload', sub: 'From Gallery', icon: <span className="text-xl">📁</span>, action: openUpload },
                          { id: 'manual', title: 'Manual', sub: 'Pick Your Tone', icon: <span className="text-xl">🎨</span>, action: openManual },
                        ].map((item) => (
                          <button
                            key={item.id}
                            onClick={item.action}
                            className="group relative flex flex-col items-center justify-center p-6 rounded-[1.5rem] bg-gray-50/50 border border-gray-100/50 hover:bg-white hover:border-gray-200 hover:shadow-xl hover:shadow-gray-200/40 transition-all duration-300"
                          >
                             <div className="mb-3 w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300 text-gray-700 group-hover:text-black">
                                {item.icon}
                             </div>
                             <h4 className="font-bold text-gray-900 mb-0.5 text-sm">{item.title}</h4>
                             <span className="text-[10px] text-gray-400 font-medium">{item.sub}</span>
                          </button>
                        ))}
                     </div>
                  </div>
               )}
             </div>
          )}

        </div>
      </div>

       {/* --- SUB MODALS (Camera, Upload, Manual) --- 
           Kept minimal/functional as they are utilities within the flow 
           but styled to match the clean aesthetic 
       */}

       {/* Camera Modal */}
      <Modal isOpen={isCameraOpen} close={closeCamera} size="medium">
          <div className="bg-white rounded-[2rem] p-8">
             <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Take a Photo</h3>
             </div>
             <div className="space-y-6">
                {!capturedImage ? (
                   <div className="relative rounded-2xl overflow-hidden border-2 border-gray-100 bg-gray-50 min-h-[300px] flex flex-col items-center justify-center">
                      {cameraError ? (
                         <div className="p-8 text-center">
                            <span className="text-4xl block mb-4">📷</span>
                            <p className="text-sm text-gray-600 mb-4">{cameraError}</p>
                            <Button onClick={startCamera}>Retry</Button>
                         </div>
                      ) : (
                         <>
                           <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                           <canvas ref={canvasRef} className="hidden" />
                           <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4">
                              <Button onClick={capturePhoto} className="px-8 bg-white text-black hover:bg-gray-100">Capture</Button>
                              <Button onClick={closeCamera} variant="transparent" className="text-white hover:bg-white/20">Cancel</Button>
                           </div>
                         </>
                      )}
                   </div>
                ) : (
                   <div className="space-y-4">
                      <img src={capturedImage} alt="Captured" className="w-full rounded-2xl border border-gray-100" />
                      {isAnalyzing && <p className="text-center text-sm font-bold animate-pulse">Analyzing...</p>}
                      <div className="flex justify-center gap-4">
                         <Button onClick={() => setCapturedImage(null)} variant="secondary">Retake</Button>
                         <Button onClick={closeCamera} className="bg-black text-white hover:bg-gray-900">Use Photo</Button>
                      </div>
                   </div>
                )}
             </div>
          </div>
      </Modal>

      {/* Upload Modal */}
      <Modal isOpen={isUploadOpen} close={closeUpload} size="medium">
          <div className="bg-white rounded-[2rem] p-8">
             <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Upload Photo</h3>
             </div>
             {!capturedImage ? (
                <div className="border-2 border-dashed border-gray-200 rounded-[2rem] p-12 text-center hover:bg-gray-50 transition-colors">
                   <div className="mb-4 text-4xl">📁</div>
                   <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" id="file-upload" />
                   <label htmlFor="file-upload" className="cursor-pointer">
                      <span className="bg-black text-white px-6 py-3 rounded-xl font-bold text-sm block w-fit mx-auto hover:bg-gray-800 transition-colors">Select Image</span>
                   </label>
                   <p className="mt-4 text-xs text-gray-400">JPG, PNG up to 10MB</p>
                </div>
             ) : (
                <div className="space-y-4">
                   <div className="h-40 w-full bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-center overflow-hidden">
                      <img src={capturedImage} alt="Upload" className="h-full w-full object-contain" />
                   </div>
                   {isAnalyzing && <p className="text-center text-sm font-bold animate-pulse">Analyzing...</p>}
                   <div className="flex justify-center gap-4">
                      <Button onClick={() => setCapturedImage(null)} variant="secondary">Change</Button>
                      <Button onClick={closeUpload} className="bg-black text-white hover:bg-gray-900">Use Photo</Button>
                   </div>
                </div>
             )}
          </div>
      </Modal>

      {/* Manual Modal */}
      <Modal isOpen={isManualOpen} close={closeManual} size="large">
         <div className="bg-white rounded-[2rem] p-8 h-[600px] flex flex-col">
            <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Select Tone</h3>
            
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
               {['all', 'fitzpatrick', 'regional', 'foundation'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f as any)}
                    className={`px-4 py-2 rounded-full text-xs font-bold capitalize transition-all ${
                       filter === f ? 'bg-black text-white shadow-lg' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                     {f}
                  </button>
               ))}
            </div>

            <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-3 pr-2 custom-scrollbar">
               {SKIN_TONE_OPTIONS.filter((tone) => {
                  if (filter === "all") return true
                  if (filter === "fitzpatrick") return tone.id.includes("fitzpatrick")
                  if (filter === "regional") return (
                     tone.id.includes("nordic") || tone.id.includes("celtic") || 
                     tone.id.includes("mediterranean") || tone.id.includes("asian") || 
                     tone.id.includes("african") || tone.id.includes("melanesian")
                  )
                  if (filter === "foundation") return tone.id.includes("foundation")
                  return true
               }).map((tone) => (
                  <button
                     key={tone.id}
                     onClick={() => handleManualSelection(tone.id)}
                     className={`flex items-center gap-4 p-3 rounded-2xl border-2 transition-all ${
                        selectedSkinTone === tone.id ? 'border-green-500 bg-green-50/50' : 'border-gray-50 hover:border-gray-200'
                     }`}
                  >
                     <div className="w-12 h-12 rounded-full shadow-sm flex-shrink-0" style={{ backgroundColor: tone.color }} />
                     <div className="text-left">
                        <p className="font-bold text-sm text-gray-900">{tone.name}</p>
                        <p className="text-[10px] text-gray-500">{tone.description}</p>
                     </div>
                     {selectedSkinTone === tone.id && <CheckCircle className="ml-auto text-green-500" />}
                  </button>
               ))}
            </div>
         </div>
      </Modal>

    </Modal>
  )
}

export default OnboardingModal
