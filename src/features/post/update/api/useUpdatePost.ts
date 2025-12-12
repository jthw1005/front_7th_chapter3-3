import { useMutation, useQueryClient } from "@tanstack/react-query"
import { postApi, postQueries, type UpdatePostDto } from "@/entities/post"

interface UpdatePostParams {
  id: number
  data: UpdatePostDto
}

export const useUpdatePost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: UpdatePostParams) => postApi.updatePost(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postQueries.all() })
    },
  })
}
