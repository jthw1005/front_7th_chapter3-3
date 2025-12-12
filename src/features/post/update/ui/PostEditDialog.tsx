import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Input, Textarea } from "@/shared/ui"
import { type PostWithAuthor } from "@/entities/post"
import { useUpdatePost } from "../api/useUpdatePost"

interface PostEditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  post: PostWithAuthor | null
}

export const PostEditDialog = ({ open, onOpenChange, post }: PostEditDialogProps) => {
  const [editedPost, setEditedPost] = useState({ title: "", body: "" })
  const updatePost = useUpdatePost()

  // Dialog가 열릴 때 post 데이터로 초기화
  useEffect(() => {
    if (open && post) {
      setEditedPost({ title: post.title, body: post.body })
    }
  }, [open, post])

  const handleUpdatePost = () => {
    if (!post) return
    updatePost.mutate(
      { id: post.id, data: editedPost },
      {
        onSuccess: () => {
          onOpenChange(false)
          toast.success("게시물이 수정되었습니다")
        },
        onError: (error) => {
          console.error("게시물 수정 실패:", error)
          toast.error("게시물 수정에 실패했습니다")
        },
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
            value={editedPost.title}
            onChange={(e) => setEditedPost({ ...editedPost, title: e.target.value })}
          />
          <Textarea
            rows={15}
            placeholder="내용"
            value={editedPost.body}
            onChange={(e) => setEditedPost({ ...editedPost, body: e.target.value })}
          />
          <Button onClick={handleUpdatePost} disabled={updatePost.isPending}>
            {updatePost.isPending ? "업데이트 중..." : "게시물 업데이트"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
