import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { postApi, postQueries, type PostsResponse } from "@/entities/post"

export const useDeletePost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => postApi.deletePost(id),

    // Optimistic update
    onMutate: async (deletedId) => {
      // 모든 posts 쿼리 취소
      await queryClient.cancelQueries({ queryKey: postQueries.all() })

      // 모든 posts 관련 쿼리의 스냅샷 저장
      const previousQueries = new Map()

      // 각 쿼리 캐시에서 삭제된 게시물 제거
      queryClient.getQueryCache().findAll({ queryKey: postQueries.all() }).forEach((query) => {
        const data = query.state.data as PostsResponse | undefined
        if (data?.posts) {
          previousQueries.set(query.queryKey, data)
          queryClient.setQueryData<PostsResponse>(query.queryKey, {
            ...data,
            posts: data.posts.filter((post) => post.id !== deletedId),
            total: data.total - 1,
          })
        }
      })

      return { previousQueries }
    },

    // 에러 시 롤백
    onError: (err, _variables, context) => {
      console.error("게시물 삭제 실패:", err)
      toast.error("게시물 삭제에 실패했습니다")

      if (context?.previousQueries) {
        context.previousQueries.forEach((data, queryKey) => {
          queryClient.setQueryData(queryKey, data)
        })
      }
    },

    // 성공 시 서버 데이터로 재검증
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: postQueries.all() })
    },

    onSuccess: () => {
      toast.success("게시물이 삭제되었습니다")
    },
  })
}
