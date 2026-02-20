
import { useContext } from "react";
import SavedPropertiesContext from "../context/SavedPropertiesContext";

export default function useSavedProperties() {
  const context = useContext(SavedPropertiesContext);

  if (!context) {
    throw new Error("useSavedProperties must be used within SavedPropertiesProvider");
  }

  return context;
}
