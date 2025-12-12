import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Input, Textarea } from "@/shared/ui"
import { type PostWithAuthor } from "@/entities/post"
import { useUpdatePost } from "../api/useUpdatePost"

interface PostEditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  post: PostWithAuthor | null
  onPostChange: (post: PostWithAuthor | null) => void
}

export const PostEditDialog = ({ open, onOpenChange, post, onPostChange }: PostEditDialogProps) => {
  const updatePost = useUpdatePost()

  const handleUpdatePost = () => {
    if (!post) return
    updatePost.mutate(
      { id: post.id, data: { title: post.title, body: post.body } },
      {
        onSuccess: () => onOpenChange(false),
      },
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>게시물 수정</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="제목"
            value={post?.title || ""}
            onChange={(e) => onPostChange(post ? { ...post, title: e.target.value } : null)}
          />
          <Textarea
            rows={15}
            placeholder="내용"
            value={post?.body || ""}
            onChange={(e) => onPostChange(post ? { ...post, body: e.target.value } : null)}
          />
          <Button onClick={handleUpdatePost} disabled={updatePost.isPending}>
            {updatePost.isPending ? "업데이트 중..." : "게시물 업데이트"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
