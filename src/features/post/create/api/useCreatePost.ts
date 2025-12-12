import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { postApi, postQueries, type CreatePostDto } from "@/entities/post"

export const useCreatePost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreatePostDto) => postApi.createPost(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: postQueries.all() })
      toast.info("쿼리 무효화 후 리페칭")
    },
  })
}
