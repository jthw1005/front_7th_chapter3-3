import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Textarea } from "@/shared/ui"
import { type Comment } from "@/entities/comment"
import { useUpdateComment } from "../api/useUpdateComment"

interface CommentEditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  comment: Comment | null
  postId: number
}

export const CommentEditDialog = ({ open, onOpenChange, comment, postId }: CommentEditDialogProps) => {
  const [editedBody, setEditedBody] = useState("")
  const updateComment = useUpdateComment()

  // Dialog가 열릴 때 comment 데이터로 초기화
  useEffect(() => {
    if (open && comment) {
      setEditedBody(comment.body)
    }
  }, [open, comment])

  const handleUpdateComment = () => {
    if (!comment) return
    updateComment.mutate(
      { id: comment.id, postId, data: { body: editedBody } },
      {
        onSuccess: () => {
          onOpenChange(false)
          toast.success("댓글이 수정되었습니다")
        },
        onError: (error) => {
          console.error("댓글 수정 실패:", error)
          toast.error("댓글 수정에 실패했습니다")
        },
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
            value={editedBody}
            onChange={(e) => setEditedBody(e.target.value)}
          />
          <Button onClick={handleUpdateComment} disabled={updateComment.isPending}>
            {updateComment.isPending ? "업데이트 중..." : "댓글 업데이트"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
