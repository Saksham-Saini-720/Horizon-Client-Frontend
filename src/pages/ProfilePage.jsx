import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchProfile, updateProfile } from "../api/authApi";
import { useProfileStore } from "../store/profileStore";
import ProfileSkeleton from "../components/ui/ProfileSkeleton";
import ProfileView from "../components/profile/ProfileView";
import ProfileEdit from "../components/profile/ProfileEdit";


export default function ProfilePage() {
  const queryClient = useQueryClient();
  const isEditing = useProfileStore((s) => s.isEditing);
  const stopEdit = useProfileStore((s) => s.stopEdit);

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
  });

  const mutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      queryClient.setQueryData(["profile"], data);
      stopEdit();
    },
  });

  if (isLoading) return <ProfileSkeleton />;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {isEditing ? (
        <ProfileEdit
          profile={profile}
          onSave={mutation.mutate}
        />
      ) : (
        <ProfileView profile={profile} />
      )}
    </div>
  );
}

