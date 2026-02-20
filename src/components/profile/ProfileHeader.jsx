import { memo } from "react";

const ProfileHeader = memo(({ name, onEdit }) => {
  console.log("Header render");

  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-semibold">Profile</h1>

      <button
        onClick={onEdit}
        className="px-4 py-2 bg-yellow-500 text-white rounded-xl hover:bg-yellow-600 transition"
      >
        Edit
      </button>
    </div>
  );
});

export default ProfileHeader;