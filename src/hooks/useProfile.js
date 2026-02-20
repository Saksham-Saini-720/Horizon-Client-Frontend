import { useState, useCallback } from "react";

const initialProfile = {
  name: "Horizon User",
  email: "user@example.com",
  phone: "+91 9876543210",
  bio: "Real estate enthusiast",
};

export default function useProfile() {
  const [profile, setProfile] = useState(initialProfile);
  const [isEditing, setIsEditing] = useState(false);

  const startEdit = useCallback(() => {
    setIsEditing(true);
  }, []);

  const cancelEdit = useCallback(() => {
    setIsEditing(false);
  }, []);

  const saveProfile = useCallback((updatedData) => {
    setProfile(updatedData);
    setIsEditing(false);
  }, []);

  return {
    profile,
    isEditing,
    startEdit,
    cancelEdit,
    saveProfile,
  };
}