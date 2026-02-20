import { create } from "zustand";

export const useProfileStore = create((set) => ({
  isEditing: false,
  startEdit: () => set({ isEditing: true }),
  cancelEdit: () => set({ isEditing: false }),
  stopEdit: () => set({ isEditing: false }),
}));