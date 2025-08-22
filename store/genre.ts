import { SelectedGenresObjType } from "@/types";
import { create } from "zustand";

const initState = {
  selectedGenresObj: {},
};

interface GenreState {
  selectedGenresObj: SelectedGenresObjType;
  clearSelectedGenresObj: () => void;
  toogleSelectedGenresObj: (genre: string) => void;
}

export const useGenreStore = create<GenreState>()((set) => ({
  ...initState,
  clearSelectedGenresObj: () => set(() => initState),
  toogleSelectedGenresObj: (genre: string) =>
    set((state) => {
      const newSelectedGenresObj = { ...state.selectedGenresObj };
      if (newSelectedGenresObj[genre]) {
        delete newSelectedGenresObj[genre];
      } else {
        newSelectedGenresObj[genre] = true;
      }
      return { selectedGenresObj: newSelectedGenresObj };
    }),
}));
