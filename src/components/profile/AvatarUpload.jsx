import { memo } from "react";

const AvatarUpload = memo(({ value, onChange }) => {
  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      onChange(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex items-center gap-4 mb-6">
      <img
        src={value || "https://via.placeholder.com/80"}
        alt="avatar"
        className="w-20 h-20 rounded-full object-cover border"
      />

      <label className="cursor-pointer px-4 py-2 border rounded-xl">
        Upload
        <input type="file" hidden onChange={handleFile} />
      </label>
    </div>
  );
});

export default AvatarUpload;

