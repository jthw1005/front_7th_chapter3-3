import { useState } from "react"
import { toast } from "sonner"
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Textarea } from "@/shared/ui"
import { useCreateComment } from "../api/useCreateComment"

interface CommentAddDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  postId: number
}

export const CommentAddDialog = ({ open, onOpenChange, postId }: CommentAddDialogProps) => {
  const [newComment, setNewComment] = useState({ body: "", postId: 0, userId: 1 })
  const createComment = useCreateComment()

  const handleAddComment = () => {
    createComment.mutate(
      { ...newComment, postId },
      {
        onSuccess: () => {
          onOpenChange(false)
          setNewComment({ body: "", postId: 0, userId: 1 })
          toast.success("댓글이 추가되었습니다")
        },
        onError: (error) => {
          console.error("댓글 추가 실패:", error)
          toast.error("댓글 추가에 실패했습니다")
        },
      },
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 댓글 추가</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            placeholder="댓글 내용"
            value={newComment.body}
            onChange={(e) => setNewComment({ ...newComment, body: e.target.value })}
          />
          <Button onClick={handleAddComment} disabled={createComment.isPending}>
            {createComment.isPending ? "추가 중..." : "댓글 추가"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
