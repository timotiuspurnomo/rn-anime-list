import { queryOptions } from "@tanstack/react-query";

export function getAnimeGenresQuery() {
  return queryOptions({
    queryKey: ["getAnimeSearch"],
    queryFn: async () => {
      const response = await fetch("https://api.tenrai.org/v1/genres/anime");
      return (await response.json()).data;
    },
  });
}
