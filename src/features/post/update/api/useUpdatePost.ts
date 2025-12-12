import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { postApi, postQueries, type UpdatePostDto } from "@/entities/post"

interface UpdatePostParams {
  id: number
  data: UpdatePostDto
}

export const useUpdatePost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: UpdatePostParams) => postApi.updatePost(id, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: postQueries.all() })
      toast.info("쿼리 무효화 후 리페칭")
    },
  })
}
