import { create } from "zustand";

type ConstantsStore = {
  baseUrl: string | null;
  setBaseUrl: (url: string) => void;
};

export const useConstantsStore = create<ConstantsStore>()((set) => ({
  baseUrl: "http://192.168.1.6:3001",
  setBaseUrl: (url) => set({ baseUrl: url }),
}));

export const useConstants = () => useConstantsStore((state) => state);
