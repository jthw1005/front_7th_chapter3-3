import { queryOptions } from "@tanstack/react-query"
import { commentApi } from "./commentApi"

export const commentQueries = {
  all: () => ["comments"] as const,

  byPostId: (postId: number) =>
    queryOptions({
      queryKey: [...commentQueries.all(), "post", postId] as const,
      queryFn: () => commentApi.getCommentsByPostId(postId),
      enabled: !!postId,
    }),
}
