export type AnimeDetailType = {
  mal_id: number;
  titles: { title: string }[];
  images: { jpg: { image_url: string } };
  score: number | null;
  genres: { name: string }[];
  synopsis: string;
  season: string;
  year: number;
  rating: string;
  scored_by: number;
  episodes: number | null;
  duration: string;
  type: string;
  status: string;
  licensors: { name: string }[];
  studios: { name: string }[];
  themes: { name: string }[];
  demographics: { name: string }[];
  source: string;
  aired: { from: Date };
};

export type AnimeFavoriteListType = {
  [key: number]: AnimeDetailType;
};

export type AnimeGenreType = {
  mal_id: number;
  name: string;
  count?: number;
};

export type SelectedGenresObjType = {
  [key: string]: boolean | undefined;
};
