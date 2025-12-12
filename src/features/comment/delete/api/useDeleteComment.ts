import { useMutation, useQueryClient } from "@tanstack/react-query"
import { commentApi, commentQueries } from "@/entities/comment"

interface DeleteCommentParams {
  id: number
  postId: number
}

export const useDeleteComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id }: DeleteCommentParams) => commentApi.deleteComment(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [...commentQueries.all(), "post", variables.postId] })
    },
  })
}
