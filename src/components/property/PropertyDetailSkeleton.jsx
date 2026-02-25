// src/components/property/PropertyDetailSkeleton.jsx
import { memo } from "react";

const PropertyDetailSkeleton = memo(() => {
  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Image Skeleton */}
      <div className="w-full h-[400px] bg-gray-200 animate-pulse" />

      {/* Content */}
      <div className="px-5 pt-5">
        {/* Tag + Type */}
        <div className="flex gap-2 mb-3">
          <div className="w-16 h-6 bg-gray-200 rounded-full animate-pulse" />
          <div className="w-24 h-6 bg-gray-200 rounded-full animate-pulse" />
        </div>

        {/* Price */}
        <div className="w-32 h-8 bg-gray-200 rounded animate-pulse mb-3" />

        {/* Title */}
        <div className="w-3/4 h-6 bg-gray-200 rounded animate-pulse mb-2" />

        {/* Location */}
        <div className="w-1/2 h-5 bg-gray-200 rounded animate-pulse mb-5" />
      </div>

      {/* Stats */}
      <div className="px-5 pt-5 pb-5">
        <div className="flex gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex-1 bg-gray-100 rounded-2xl p-4 h-24 animate-pulse" />
          ))}
        </div>
      </div>

      {/* Description */}
      <div className="px-5 pt-4 pb-5 border-t border-gray-100">
        <div className="w-24 h-5 bg-gray-200 rounded animate-pulse mb-3" />
        <div className="space-y-2">
          <div className="w-full h-4 bg-gray-200 rounded animate-pulse" />
          <div className="w-5/6 h-4 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>

      {/* Amenities */}
      <div className="px-5 pt-4 pb-5 border-t border-gray-100">
        <div className="w-20 h-5 bg-gray-200 rounded animate-pulse mb-3" />
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-24 h-8 bg-gray-200 rounded-full animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
});

export default PropertyDetailSkeleton;
