import { queryOptions } from "@tanstack/react-query";

export function getAnimeGenresQuery() {
  return queryOptions({
    queryKey: ["getAnimeSearch"],
    queryFn: async () => {
      const response = await fetch("https://api.jikan.moe/v4/genres/anime");
      return (await response.json()).data;
    },
  });
}
