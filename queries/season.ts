import { infiniteQueryOptions } from "@tanstack/react-query";

type GetSeasonNowParams = {
  limit: number;
};

export function getSeasonNowInfQuery(params: GetSeasonNowParams) {
  return infiniteQueryOptions({
    queryKey: ["getSeasonNow"],
    queryFn: async ({ pageParam }) => {
      const url = new URL("https://api.jikan.moe/v4/seasons/now");
      Object.entries({ ...params, page: pageParam }).forEach(([key, value]) =>
        url.searchParams.append(key, `${value}`)
      );
      const response = await fetch(url);
      return await response.json();
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage?.pagination?.has_next_page
        ? lastPage?.pagination?.current_page + 1
        : undefined,
  });
}
