import { memo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema } from "../../schema/profileSchema";
import { useProfileStore } from "../../store/profileStore";
import AvatarUpload from "./AvatarUpload";

const Input = memo(({ label, register, name, error }) => (
  <div className="mb-4">
    <label className="block text-sm text-gray-500 mb-1">{label}</label>
    <input
      {...register(name)}
      className="w-full border rounded-xl px-3 py-2"
    />
    {error && <p className="text-red-500 text-sm">{error}</p>}
  </div>
));

const ProfileEdit = memo(({ profile, onSave }) => {
  const stopEdit = useProfileStore((s) => s.stopEdit);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: profile,
  });

  const avatar = watch("avatar");

  return (
    <form
      onSubmit={handleSubmit(onSave)}
      className="bg-white rounded-2xl shadow p-6"
    >
      <AvatarUpload
        value={avatar}
        onChange={(v) => setValue("avatar", v)}
      />

      <Input label="Name" name="name" register={register} error={errors.name?.message} />
      <Input label="Email" name="email" register={register} error={errors.email?.message} />
      <Input label="Phone" name="phone" register={register} error={errors.phone?.message} />
      <Input label="Bio" name="bio" register={register} error={errors.bio?.message} />

      <div className="flex gap-3 mt-6">
        <button className="px-4 py-2 bg-green-600 text-white rounded-xl">
          Save
        </button>

        <button
          type="button"
          onClick={stopEdit}
          className="px-4 py-2 border rounded-xl"
        >
          Cancel
        </button>
      </div>
    </form>
  );
});

export default ProfileEdit;


