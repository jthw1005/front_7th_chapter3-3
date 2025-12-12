import { baseApi } from "@/shared/api"
import type { Tag } from "../model/types"

export const tagApi = {
  getTags: () => baseApi.get<Tag[]>("/posts/tags"),
}
