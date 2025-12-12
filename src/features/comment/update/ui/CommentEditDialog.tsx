import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Textarea } from "@/shared/ui"
import { type Comment } from "@/entities/comment"
import { useUpdateComment } from "../api/useUpdateComment"

interface CommentEditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  comment: Comment | null
  postId: number
  onCommentChange: (comment: Comment | null) => void
}

export const CommentEditDialog = ({
  open,
  onOpenChange,
  comment,
  postId,
  onCommentChange,
}: CommentEditDialogProps) => {
  const updateComment = useUpdateComment()

  const handleUpdateComment = () => {
    if (!comment) return
    updateComment.mutate(
      { id: comment.id, postId, data: { body: comment.body } },
      {
        onSuccess: () => onOpenChange(false),
      },
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>댓글 수정</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            placeholder="댓글 내용"
            value={comment?.body || ""}
            onChange={(e) => onCommentChange(comment ? { ...comment, body: e.target.value } : null)}
          />
          <Button onClick={handleUpdateComment} disabled={updateComment.isPending}>
            {updateComment.isPending ? "업데이트 중..." : "댓글 업데이트"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
