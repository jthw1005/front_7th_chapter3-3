import { useMutation, useQueryClient } from "@tanstack/react-query"
import { commentApi, commentQueries, type UpdateCommentDto } from "@/entities/comment"

interface UpdateCommentParams {
  id: number
  postId: number
  data: UpdateCommentDto
}

export const useUpdateComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: UpdateCommentParams) => commentApi.updateComment(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [...commentQueries.all(), "post", variables.postId] })
    },
  })
}
