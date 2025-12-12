import { baseApi } from "@/shared/api"
import type { User, UsersResponse } from "../model/types"

export const userApi = {
  getUsers: () =>
    baseApi.get<UsersResponse>("/users", { limit: 0, select: "username,image" }),

  getUserById: (id: number) =>
    baseApi.get<User>(`/users/${id}`),
}
