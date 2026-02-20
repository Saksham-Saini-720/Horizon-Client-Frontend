import { memo } from "react";

const SkeletonLine = () => (
  <div className="h-4 bg-gray-200 rounded animate-pulse mb-3" />
);

const ProfileSkeleton = memo(() => {
  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <div className="w-20 h-20 rounded-full bg-gray-200 animate-pulse mb-6" />
      <SkeletonLine />
      <SkeletonLine />
      <SkeletonLine />
      <SkeletonLine />
    </div>
  );
});

export default ProfileSkeleton;