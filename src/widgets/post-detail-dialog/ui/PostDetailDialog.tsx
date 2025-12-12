import { useQuery } from "@tanstack/react-query"
import { Edit2, Plus, ThumbsUp, Trash2 } from "lucide-react"
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui"
import { highlightText } from "@/shared/lib"
import { commentQueries, type Comment } from "@/entities/comment"
import { type PostWithAuthor } from "@/entities/post"
import { useLikeComment, useDeleteComment } from "@/features/comment"

interface PostDetailDialogProps {
  post: PostWithAuthor | null
  open: boolean
  onOpenChange: (open: boolean) => void
  searchQuery: string
  onAddComment: (postId: number) => void
  onEditComment: (comment: Comment) => void
}

export const PostDetailDialog = ({
  post,
  open,
  onOpenChange,
  searchQuery,
  onAddComment,
  onEditComment,
}: PostDetailDialogProps) => {
  const { data: commentsData } = useQuery({
    ...commentQueries.byPostId(post?.id ?? 0),
    enabled: !!post?.id && open,
  })

  const likeComment = useLikeComment()
  const deleteComment = useDeleteComment()

  const handleLike = (comment: Comment) => {
    if (!post?.id) return
    likeComment.mutate({
      id: comment.id,
      postId: post.id,
      currentLikes: comment.likes,
    })
  }

  const handleDelete = (commentId: number) => {
    if (!post?.id) return
    deleteComment.mutate({ id: commentId, postId: post.id })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{highlightText(post?.title, searchQuery)}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>{highlightText(post?.body, searchQuery)}</p>

          {post?.id && (
            <div className="mt-2">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold">댓글</h3>
                <Button size="sm" onClick={() => onAddComment(post.id)}>
                  <Plus className="w-3 h-3 mr-1" />
                  댓글 추가
                </Button>
              </div>
              <div className="space-y-1">
                {commentsData?.comments?.map((comment) => (
                  <div key={comment.id} className="flex items-center justify-between text-sm border-b pb-1">
                    <div className="flex items-center space-x-2 overflow-hidden">
                      <span className="font-medium truncate">{comment.user.username}:</span>
                      <span className="truncate">{highlightText(comment.body, searchQuery)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button variant="ghost" size="sm" onClick={() => handleLike(comment)}>
                        <ThumbsUp className="w-3 h-3" />
                        <span className="ml-1 text-xs">{comment.likes}</span>
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => onEditComment(comment)}>
                        <Edit2 className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(comment.id)}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
