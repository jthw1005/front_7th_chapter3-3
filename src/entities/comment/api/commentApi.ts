import { baseApi } from "@/shared/api"
import type { Comment, CommentsResponse, CreateCommentDto, UpdateCommentDto } from "../model/types"

export const commentApi = {
  getCommentsByPostId: (postId: number) =>
    baseApi.get<CommentsResponse>(`/comments/post/${postId}`),

  createComment: (data: CreateCommentDto) =>
    baseApi.post<Comment>("/comments/add", data),

  updateComment: (id: number, data: UpdateCommentDto) =>
    baseApi.put<Comment>(`/comments/${id}`, data),

  deleteComment: (id: number) =>
    baseApi.delete<Comment>(`/comments/${id}`),

  likeComment: (id: number, likes: number) =>
    baseApi.patch<Comment>(`/comments/${id}`, { likes }),
}
