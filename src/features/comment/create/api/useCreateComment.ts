import { useMutation, useQueryClient } from "@tanstack/react-query"
import { commentApi, commentQueries, type CreateCommentDto } from "@/entities/comment"

export const useCreateComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateCommentDto) => commentApi.createComment(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [...commentQueries.all(), "post", variables.postId] })
    },
  })
}
