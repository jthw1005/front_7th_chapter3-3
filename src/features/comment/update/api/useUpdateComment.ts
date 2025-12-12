import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
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
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({ queryKey: [...commentQueries.all(), "post", variables.postId] })
      toast.info("쿼리 무효화 후 리페칭")
    },
  })
}
