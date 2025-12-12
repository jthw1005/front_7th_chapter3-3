import { create } from "zustand"
import { type PostWithAuthor } from "@/entities/post"
import { type Comment } from "@/entities/comment"

interface DialogState {
  // 다이얼로그 상태
  showAddPostDialog: boolean
  showEditPostDialog: boolean
  showPostDetailDialog: boolean
  showAddCommentDialog: boolean
  showEditCommentDialog: boolean
  showUserModal: boolean

  // 선택된 항목
  selectedPost: PostWithAuthor | null
  selectedUserId: number | null
  selectedComment: Comment | null
  commentPostId: number

  // 액션
  openAddPostDialog: () => void
  closeAddPostDialog: () => void

  openEditPostDialog: (post: PostWithAuthor) => void
  closeEditPostDialog: () => void

  openPostDetailDialog: (post: PostWithAuthor) => void
  closePostDetailDialog: () => void

  openAddCommentDialog: (postId: number) => void
  closeAddCommentDialog: () => void

  openEditCommentDialog: (comment: Comment, postId: number) => void
  closeEditCommentDialog: () => void

  openUserModal: (userId: number) => void
  closeUserModal: () => void

  setSelectedPost: (post: PostWithAuthor | null) => void
  setSelectedComment: (comment: Comment | null) => void
}

export const useDialogStore = create<DialogState>((set) => ({
  // 초기 상태
  showAddPostDialog: false,
  showEditPostDialog: false,
  showPostDetailDialog: false,
  showAddCommentDialog: false,
  showEditCommentDialog: false,
  showUserModal: false,

  selectedPost: null,
  selectedUserId: null,
  selectedComment: null,
  commentPostId: 0,

  // 게시물 추가
  openAddPostDialog: () => set({ showAddPostDialog: true }),
  closeAddPostDialog: () => set({ showAddPostDialog: false }),

  // 게시물 수정
  openEditPostDialog: (post) => set({ showEditPostDialog: true, selectedPost: post }),
  closeEditPostDialog: () => set({ showEditPostDialog: false }),

  // 게시물 상세
  openPostDetailDialog: (post) => set({ showPostDetailDialog: true, selectedPost: post }),
  closePostDetailDialog: () => set({ showPostDetailDialog: false }),

  // 댓글 추가
  openAddCommentDialog: (postId) => set({ showAddCommentDialog: true, commentPostId: postId }),
  closeAddCommentDialog: () => set({ showAddCommentDialog: false }),

  // 댓글 수정
  openEditCommentDialog: (comment, postId) =>
    set({ showEditCommentDialog: true, selectedComment: comment, commentPostId: postId }),
  closeEditCommentDialog: () => set({ showEditCommentDialog: false }),

  // 사용자 모달
  openUserModal: (userId) => set({ showUserModal: true, selectedUserId: userId }),
  closeUserModal: () => set({ showUserModal: false }),

  // 선택된 항목 업데이트
  setSelectedPost: (post) => set({ selectedPost: post }),
  setSelectedComment: (comment) => set({ selectedComment: comment }),
}))
