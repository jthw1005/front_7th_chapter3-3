import { useMutation, useQueryClient } from "@tanstack/react-query"
import { postApi, postQueries, type CreatePostDto } from "@/entities/post"

export const useCreatePost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreatePostDto) => postApi.createPost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postQueries.all() })
    },
  })
}
