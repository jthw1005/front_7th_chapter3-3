import { queryOptions } from "@tanstack/react-query"
import { tagApi } from "./tagApi"

export const tagQueries = {
  all: () => ["tags"] as const,

  list: () =>
    queryOptions({
      queryKey: tagQueries.all(),
      queryFn: () => tagApi.getTags(),
      staleTime: 1000 * 60 * 10, // 10분 캐시 (태그는 거의 안 바뀜)
    }),
}
