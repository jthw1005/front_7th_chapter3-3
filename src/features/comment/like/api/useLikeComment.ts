import { useMutation, useQueryClient } from "@tanstack/react-query"
import { commentApi, commentQueries } from "@/entities/comment"

interface LikeCommentParams {
  id: number
  postId: number
  currentLikes: number
}

export const useLikeComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, currentLikes }: LikeCommentParams) =>
      commentApi.likeComment(id, currentLikes + 1),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [...commentQueries.all(), "post", variables.postId] })
    },
  })
}
