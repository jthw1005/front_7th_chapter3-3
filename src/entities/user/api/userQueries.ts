import { queryOptions } from "@tanstack/react-query"
import { userApi } from "./userApi"

export const userQueries = {
  all: () => ["users"] as const,

  list: () =>
    queryOptions({
      queryKey: [...userQueries.all(), "list"] as const,
      queryFn: () => userApi.getUsers(),
      staleTime: 1000 * 60 * 5, // 5분 캐시 (유저 정보는 자주 안 바뀜)
    }),

  detail: (id: number) =>
    queryOptions({
      queryKey: [...userQueries.all(), "detail", id] as const,
      queryFn: () => userApi.getUserById(id),
      enabled: !!id,
    }),
}
