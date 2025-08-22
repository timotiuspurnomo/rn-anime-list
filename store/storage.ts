import { StateStorage } from "zustand/middleware";
import { MMKV } from "react-native-mmkv";

export const createStorage: (storageId: string) => StateStorage = (
  storageId: string
) => {
  const storage = new MMKV({
    id: storageId,
  });

  return {
    setItem: (name, value) => {
      return storage.set(`${storageId}.${name}`, value);
    },
    getItem: (name) => {
      const value = storage.getString(`${storageId}.${name}`);
      return value ?? null;
    },
    removeItem: (name) => {
      return storage.delete(`${storageId}.${name}`);
    },
  };
};
