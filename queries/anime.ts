import { queryOptions, infiniteQueryOptions } from "@tanstack/react-query";

type GetAnimeSearchParams = {
  q: string;
  limit: number;
  genres?: string;
};

export function getAnimeByIdQuery(id: number) {
  return queryOptions({
    queryKey: ["getAnimeByIdQuery", id],
    queryFn: async () => {
      const response = await fetch(`https://api.tenrai.org/v1/anime/${id}`);
      return (await response.json()).data;
    },
  });
}

export function getAnimeSearchInfQuery(params: GetAnimeSearchParams) {
  return infiniteQueryOptions({
    queryKey: ["getAnimeSearch", params.q, params.genres],
    queryFn: async ({ pageParam }) => {
      const url = new URL("https://api.tenrai.org/v1/anime");
      Object.entries({ ...params, page: pageParam }).forEach(([key, value]) =>
        url.searchParams.append(key, `${value}`),
      );
      const response = await fetch(url);
      return await response.json();
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage?.pagination?.has_next_page
        ? lastPage?.pagination?.current_page + 1
        : undefined,
    staleTime: 0,
  });
}
