import { useMutation, useQueryClient } from "@tanstack/react-query"
import { postApi, postQueries } from "@/entities/post"

export const useDeletePost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => postApi.deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postQueries.all() })
    },
  })
}
