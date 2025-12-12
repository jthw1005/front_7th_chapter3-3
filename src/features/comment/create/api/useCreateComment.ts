import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { commentApi, commentQueries, type CreateCommentDto } from "@/entities/comment"

export const useCreateComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateCommentDto) => commentApi.createComment(data),
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({ queryKey: [...commentQueries.all(), "post", variables.postId] })
      toast.info("쿼리 무효화 후 리페칭")
    },
  })
}
