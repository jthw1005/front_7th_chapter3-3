import { baseApi } from "@/shared/api"
import type { Post, PostsResponse, CreatePostDto, UpdatePostDto } from "../model/types"

export const postApi = {
  getPosts: (params: { limit: number; skip: number }) =>
    baseApi.get<PostsResponse>("/posts", params),

  getPostsByTag: (tag: string) =>
    baseApi.get<PostsResponse>(`/posts/tag/${tag}`),

  searchPosts: (query: string) =>
    baseApi.get<PostsResponse>("/posts/search", { q: query }),

  createPost: (data: CreatePostDto) =>
    baseApi.post<Post>("/posts/add", data),

  updatePost: (id: number, data: UpdatePostDto) =>
    baseApi.put<Post>(`/posts/${id}`, data),

  deletePost: (id: number) =>
    baseApi.delete<Post>(`/posts/${id}`),
}
