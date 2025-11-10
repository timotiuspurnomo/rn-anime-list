import { createJSONStorage, persist } from "zustand/middleware";
import { AnimeDetailType, AnimeFavoriteListType } from "@/types";
import { createStorage } from "./storage";
import { create } from "zustand";

const initState = {
  favouriteAnimeList: {},
};

interface FavoriteState {
  favouriteAnimeList: AnimeFavoriteListType;
  toogleFavorite: (animeDetail: AnimeDetailType) => void;
}

export const useFavoriteStore = create<FavoriteState>()(
  persist(
    (set, get) => ({
      ...initState,
      toogleFavorite: (animeDetail) =>
        set(() => {
          const newFavouriteAnimeList = { ...get().favouriteAnimeList };
          if (newFavouriteAnimeList[animeDetail.mal_id]) {
            delete newFavouriteAnimeList[animeDetail.mal_id];
          } else {
            newFavouriteAnimeList[animeDetail.mal_id] = {
              mal_id: animeDetail.mal_id,
              titles: animeDetail.titles,
              images: animeDetail.images,
              score: animeDetail.score,
              genres: animeDetail.genres,
            };
          }
          return { favouriteAnimeList: newFavouriteAnimeList };
        }),
    }),
    {
      name: "favorite-storage",
      storage: createJSONStorage(() => createStorage("favorite-storage")),
    }
  )
);
