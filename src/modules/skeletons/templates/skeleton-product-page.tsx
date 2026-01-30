import React from "react";
import SkeletonButton from "@modules/skeletons/components/skeleton-button";

const SkeletonProductPage = () => (
  <div className="content-container flex flex-col small:flex-row small:items-start py-6 relative min-h-screen gap-x-8">
    {/* Left column: info/tabs skeleton */}
    <div className="flex flex-col small:max-w-[300px] w-full py-8 gap-y-6">
      <div className="h-8 w-2/3 bg-gray-200 rounded mb-4" /> {/* Title */}
      <div className="h-4 w-1/2 bg-gray-100 rounded mb-2" /> {/* Subtitle */}
      <div className="h-4 w-1/3 bg-gray-100 rounded mb-2" /> {/* Tabs */}
    </div>
    {/* Center column: image skeleton */}
    <div className="w-full relative flex items-center justify-center">
      <div className="aspect-[29/34] w-full max-w-[500px] bg-gray-200 rounded-lg animate-pulse" />
    </div>
    {/* Right column: actions/options skeleton */}
    <div className="flex flex-col small:max-w-[300px] w-full pt-0 pb-2 gap-y-6 min-h-screen">
      <div className="h-8 w-2/3 bg-gray-200 rounded mb-4" /> {/* Price */}
      <SkeletonButton />
      <div className="h-4 w-1/2 bg-gray-100 rounded mb-2" /> {/* Option 1 */}
      <div className="h-4 w-1/2 bg-gray-100 rounded mb-2" /> {/* Option 2 */}
    </div>
  </div>
);

export default SkeletonProductPage; 