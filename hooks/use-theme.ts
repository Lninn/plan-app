import { useStore } from "@/lib/store"
import { useShallow } from "zustand/react/shallow"


export default function useTheme() {
  return useStore(
    useShallow((store) => ({
      theme: store.theme,
      setTheme: store.setTheme,
    })),
  );
}
