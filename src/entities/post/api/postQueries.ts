import { queryOptions } from "@tanstack/react-query"
import { postApi } from "./postApi"

export const postQueries = {
  all: () => ["posts"] as const,

  lists: () => [...postQueries.all(), "list"] as const,

  list: (params: { limit: number; skip: number }) =>
    queryOptions({
      queryKey: [...postQueries.lists(), params] as const,
      queryFn: () => postApi.getPosts(params),
    }),

  byTag: (tag: string) =>
    queryOptions({
      queryKey: [...postQueries.all(), "tag", tag] as const,
      queryFn: () => postApi.getPostsByTag(tag),
      enabled: !!tag && tag !== "all",
    }),

  search: (query: string) =>
    queryOptions({
      queryKey: [...postQueries.all(), "search", query] as const,
      queryFn: () => postApi.searchPosts(query),
      enabled: !!query,
    }),
}
