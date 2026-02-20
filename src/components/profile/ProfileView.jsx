import { memo } from "react";
import { useProfileStore } from "../../store/profileStore";

const Field = memo(({ label, value }) => (
  <div className="mb-4">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="font-medium">{value}</p>
  </div>
));

const ProfileView = memo(({ profile }) => {
  const startEdit = useProfileStore((s) => s.startEdit);

  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">Profile</h2>
        <button
          onClick={startEdit}
          className="px-4 py-2 bg-yellow-500 text-white rounded-xl"
        >
          Edit
        </button>
      </div>

      <img
        src={profile.avatar || "https://via.placeholder.com/80"}
        className="w-20 h-20 rounded-full mb-6"
      />

      <Field label="Name" value={profile.name} />
      <Field label="Email" value={profile.email} />
      <Field label="Phone" value={profile.phone} />
      <Field label="Bio" value={profile.bio} />
    </div>
  );
});

export default ProfileView;
