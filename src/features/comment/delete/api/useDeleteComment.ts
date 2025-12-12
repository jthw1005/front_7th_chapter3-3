import { useMutation, useQueryClient } from "@tanstack/react-query"
import { commentApi, commentQueries, type CommentsResponse } from "@/entities/comment"

interface DeleteCommentParams {
  id: number
  postId: number
}

export const useDeleteComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id }: DeleteCommentParams) => commentApi.deleteComment(id),

    // Optimistic update
    onMutate: async ({ id, postId }) => {
      const queryKey = [...commentQueries.all(), "post", postId]

      // 진행 중인 refetch 취소
      await queryClient.cancelQueries({ queryKey })

      // 이전 데이터 스냅샷 저장
      const previousComments = queryClient.getQueryData<CommentsResponse>(queryKey)

      // Optimistic update 적용 - 댓글 삭제
      if (previousComments) {
        queryClient.setQueryData<CommentsResponse>(queryKey, {
          ...previousComments,
          comments: previousComments.comments.filter((comment) => comment.id !== id),
          total: previousComments.total - 1,
        })
      }

      return { previousComments, queryKey }
    },

    // 에러 시 롤백
    onError: (_err, _variables, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(context.queryKey, context.previousComments)
      }
    },

    // 성공 시 서버 데이터로 재검증
    onSettled: (_, __, variables) => {
      queryClient.invalidateQueries({ queryKey: [...commentQueries.all(), "post", variables.postId] })
    },
  })
}
