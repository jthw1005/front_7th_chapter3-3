import { useMutation, useQueryClient } from "@tanstack/react-query"
import { commentApi, commentQueries, type CommentsResponse } from "@/entities/comment"

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

    // Optimistic update
    onMutate: async ({ id, postId, currentLikes }) => {
      const queryKey = [...commentQueries.all(), "post", postId]

      // 진행 중인 refetch 취소
      await queryClient.cancelQueries({ queryKey })

      // 이전 데이터 스냅샷 저장
      const previousComments = queryClient.getQueryData<CommentsResponse>(queryKey)

      // Optimistic update 적용
      if (previousComments) {
        queryClient.setQueryData<CommentsResponse>(queryKey, {
          ...previousComments,
          comments: previousComments.comments.map((comment) =>
            comment.id === id ? { ...comment, likes: currentLikes + 1 } : comment,
          ),
        })
      }

      // 롤백을 위한 컨텍스트 반환
      return { previousComments, queryKey }
    },

    // 에러 시 롤백
    onError: (_err, _variables, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(context.queryKey, context.previousComments)
      }
    },

    // 성공 시 서버 데이터로 재검증
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({ queryKey: [...commentQueries.all(), "post", variables.postId] })
    },
  })
}
