import { useState, useEffect, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { Plus, Search } from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "@/shared/ui"
import { postQueries, type PostWithAuthor } from "@/entities/post"
import { userQueries } from "@/entities/user"
import { tagQueries } from "@/entities/tag"
import { type Comment } from "@/entities/comment"
import { useCreatePost, useUpdatePost, useDeletePost } from "@/features/post"
import { useCreateComment, useUpdateComment } from "@/features/comment"
import { PostTable } from "@/widgets/post-table"
import { PostDetailDialog } from "@/widgets/post-detail-dialog"
import { UserModal } from "@/widgets/user-modal"

const PostsManagerPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)

  // URL 상태
  const [skip, setSkip] = useState(parseInt(queryParams.get("skip") || "0"))
  const [limit, setLimit] = useState(parseInt(queryParams.get("limit") || "10"))
  const [searchQuery, setSearchQuery] = useState(queryParams.get("search") || "")
  const [sortBy, setSortBy] = useState(queryParams.get("sortBy") || "")
  const [sortOrder, setSortOrder] = useState(queryParams.get("sortOrder") || "asc")
  const [selectedTag, setSelectedTag] = useState(queryParams.get("tag") || "")

  // 다이얼로그 상태
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showPostDetailDialog, setShowPostDetailDialog] = useState(false)
  const [showAddCommentDialog, setShowAddCommentDialog] = useState(false)
  const [showEditCommentDialog, setShowEditCommentDialog] = useState(false)
  const [showUserModal, setShowUserModal] = useState(false)

  // 선택된 항목
  const [selectedPost, setSelectedPost] = useState<PostWithAuthor | null>(null)
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null)
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null)

  // 폼 상태
  const [newPost, setNewPost] = useState({ title: "", body: "", userId: 1 })
  const [newComment, setNewComment] = useState({ body: "", postId: 0, userId: 1 })

  // TanStack Query - 게시물 목록
  const { data: postsData, isLoading: isPostsLoading } = useQuery({
    ...postQueries.list({ limit, skip }),
    enabled: !selectedTag || selectedTag === "all",
  })

  // TanStack Query - 태그별 게시물
  const { data: tagPostsData, isLoading: isTagPostsLoading } = useQuery({
    ...postQueries.byTag(selectedTag),
    enabled: !!selectedTag && selectedTag !== "all",
  })

  // TanStack Query - 검색
  const { data: searchData, isLoading: isSearchLoading, refetch: refetchSearch } = useQuery({
    ...postQueries.search(searchQuery),
    enabled: false, // 수동으로 트리거
  })

  // TanStack Query - 유저 목록
  const { data: usersData } = useQuery(userQueries.list())

  // TanStack Query - 태그 목록
  const { data: tags } = useQuery(tagQueries.list())

  // Mutations
  const createPost = useCreatePost()
  const updatePost = useUpdatePost()
  const deletePost = useDeletePost()
  const createComment = useCreateComment()
  const updateComment = useUpdateComment()

  // 게시물 + 작성자 정보 결합
  const postsWithAuthors = useMemo((): PostWithAuthor[] => {
    const rawPosts = searchData?.posts ?? tagPostsData?.posts ?? postsData?.posts ?? []
    const users = usersData?.users ?? []

    return rawPosts.map((post) => ({
      ...post,
      author: users.find((user) => user.id === post.userId),
    }))
  }, [postsData, tagPostsData, searchData, usersData])

  const total = searchData?.total ?? tagPostsData?.total ?? postsData?.total ?? 0
  const isLoading = isPostsLoading || isTagPostsLoading || isSearchLoading

  // URL 업데이트
  const updateURL = (updates: {
    skip?: number
    limit?: number
    searchQuery?: string
    sortBy?: string
    sortOrder?: string
    selectedTag?: string
  } = {}) => {
    const params = new URLSearchParams()
    const newSkip = updates.skip ?? skip
    const newLimit = updates.limit ?? limit
    const newSearchQuery = updates.searchQuery ?? searchQuery
    const newSortBy = updates.sortBy ?? sortBy
    const newSortOrder = updates.sortOrder ?? sortOrder
    const newSelectedTag = updates.selectedTag ?? selectedTag

    if (newSkip) params.set("skip", newSkip.toString())
    if (newLimit) params.set("limit", newLimit.toString())
    if (newSearchQuery) params.set("search", newSearchQuery)
    if (newSortBy) params.set("sortBy", newSortBy)
    if (newSortOrder) params.set("sortOrder", newSortOrder)
    if (newSelectedTag) params.set("tag", newSelectedTag)
    navigate(`?${params.toString()}`)
  }

  // URL에서 초기값 읽기 (컴포넌트 마운트 시에만)
  const syncStateFromURL = () => {
    const params = new URLSearchParams(location.search)
    const urlSkip = parseInt(params.get("skip") || "0")
    const urlLimit = parseInt(params.get("limit") || "10")
    const urlSearchQuery = params.get("search") || ""
    const urlSortBy = params.get("sortBy") || ""
    const urlSortOrder = params.get("sortOrder") || "asc"
    const urlSelectedTag = params.get("tag") || ""

    if (urlSkip !== skip) setSkip(urlSkip)
    if (urlLimit !== limit) setLimit(urlLimit)
    if (urlSearchQuery !== searchQuery) setSearchQuery(urlSearchQuery)
    if (urlSortBy !== sortBy) setSortBy(urlSortBy)
    if (urlSortOrder !== sortOrder) setSortOrder(urlSortOrder)
    if (urlSelectedTag !== selectedTag) setSelectedTag(urlSelectedTag)
  }

  // 브라우저 뒤로가기/앞으로가기 시 URL 동기화
  useEffect(() => {
    syncStateFromURL()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search])

  // 검색 실행
  const handleSearch = () => {
    if (searchQuery) {
      refetchSearch()
    }
  }

  // 게시물 추가
  const handleAddPost = () => {
    createPost.mutate(newPost, {
      onSuccess: () => {
        setShowAddDialog(false)
        setNewPost({ title: "", body: "", userId: 1 })
      },
    })
  }

  // 게시물 수정
  const handleUpdatePost = () => {
    if (!selectedPost) return
    updatePost.mutate(
      { id: selectedPost.id, data: { title: selectedPost.title, body: selectedPost.body } },
      {
        onSuccess: () => setShowEditDialog(false),
      },
    )
  }

  // 게시물 삭제
  const handleDeletePost = (id: number) => {
    deletePost.mutate(id)
  }

  // 댓글 추가
  const handleAddComment = () => {
    createComment.mutate(newComment, {
      onSuccess: () => {
        setShowAddCommentDialog(false)
        setNewComment({ body: "", postId: 0, userId: 1 })
      },
    })
  }

  // 댓글 수정
  const handleUpdateComment = () => {
    if (!selectedComment || !selectedPost) return
    updateComment.mutate(
      { id: selectedComment.id, postId: selectedPost.id, data: { body: selectedComment.body } },
      {
        onSuccess: () => setShowEditCommentDialog(false),
      },
    )
  }

  // 태그 클릭
  const handleTagClick = (tag: string) => {
    setSelectedTag(tag)
    updateURL({ selectedTag: tag })
  }

  // 작성자 클릭
  const handleAuthorClick = (userId: number) => {
    setSelectedUserId(userId)
    setShowUserModal(true)
  }

  // 게시물 상세 보기
  const handlePostDetail = (post: PostWithAuthor) => {
    setSelectedPost(post)
    setShowPostDetailDialog(true)
  }

  // 게시물 수정 다이얼로그 열기
  const handleEditPost = (post: PostWithAuthor) => {
    setSelectedPost(post)
    setShowEditDialog(true)
  }

  // 댓글 추가 다이얼로그 열기
  const handleOpenAddComment = (postId: number) => {
    setNewComment((prev) => ({ ...prev, postId }))
    setShowAddCommentDialog(true)
  }

  // 댓글 수정 다이얼로그 열기
  const handleEditComment = (comment: Comment) => {
    setSelectedComment(comment)
    setShowEditCommentDialog(true)
  }

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>게시물 관리자</span>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            게시물 추가
          </Button>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col gap-4">
          {/* 검색 및 필터 컨트롤 */}
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="게시물 검색..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
            </div>
            <Select
              value={selectedTag}
              onValueChange={(value) => {
                setSelectedTag(value)
                updateURL({ selectedTag: value })
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="태그 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 태그</SelectItem>
                {tags?.map((tag) => (
                  <SelectItem key={tag.url} value={tag.slug}>
                    {tag.slug}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={sortBy}
              onValueChange={(value) => {
                setSortBy(value)
                updateURL({ sortBy: value })
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="정렬 기준" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">없음</SelectItem>
                <SelectItem value="id">ID</SelectItem>
                <SelectItem value="title">제목</SelectItem>
                <SelectItem value="reactions">반응</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={sortOrder}
              onValueChange={(value) => {
                setSortOrder(value)
                updateURL({ sortOrder: value })
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="정렬 순서" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">오름차순</SelectItem>
                <SelectItem value="desc">내림차순</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 게시물 테이블 */}
          {isLoading ? (
            <div className="flex justify-center p-4">로딩 중...</div>
          ) : (
            <PostTable
              posts={postsWithAuthors}
              searchQuery={searchQuery}
              selectedTag={selectedTag}
              onTagClick={handleTagClick}
              onAuthorClick={handleAuthorClick}
              onDetail={handlePostDetail}
              onEdit={handleEditPost}
              onDelete={handleDeletePost}
            />
          )}

          {/* 페이지네이션 */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span>표시</span>
              <Select
                value={limit.toString()}
                onValueChange={(value) => {
                  const newLimit = Number(value)
                  setLimit(newLimit)
                  updateURL({ limit: newLimit })
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="10" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="30">30</SelectItem>
                </SelectContent>
              </Select>
              <span>항목</span>
            </div>
            <div className="flex gap-2">
              <Button
                disabled={skip === 0}
                onClick={() => {
                  const newSkip = Math.max(0, skip - limit)
                  setSkip(newSkip)
                  updateURL({ skip: newSkip })
                }}
              >
                이전
              </Button>
              <Button
                disabled={skip + limit >= total}
                onClick={() => {
                  const newSkip = skip + limit
                  setSkip(newSkip)
                  updateURL({ skip: newSkip })
                }}
              >
                다음
              </Button>
            </div>
          </div>
        </div>
      </CardContent>

      {/* 게시물 추가 대화상자 */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>새 게시물 추가</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="제목"
              value={newPost.title}
              onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
            />
            <Textarea
              rows={30}
              placeholder="내용"
              value={newPost.body}
              onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
            />
            <Input
              type="number"
              placeholder="사용자 ID"
              value={newPost.userId}
              onChange={(e) => setNewPost({ ...newPost, userId: Number(e.target.value) })}
            />
            <Button onClick={handleAddPost} disabled={createPost.isPending}>
              {createPost.isPending ? "추가 중..." : "게시물 추가"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 게시물 수정 대화상자 */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>게시물 수정</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="제목"
              value={selectedPost?.title || ""}
              onChange={(e) => setSelectedPost((prev) => (prev ? { ...prev, title: e.target.value } : null))}
            />
            <Textarea
              rows={15}
              placeholder="내용"
              value={selectedPost?.body || ""}
              onChange={(e) => setSelectedPost((prev) => (prev ? { ...prev, body: e.target.value } : null))}
            />
            <Button onClick={handleUpdatePost} disabled={updatePost.isPending}>
              {updatePost.isPending ? "업데이트 중..." : "게시물 업데이트"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 댓글 추가 대화상자 */}
      <Dialog open={showAddCommentDialog} onOpenChange={setShowAddCommentDialog}>
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

      {/* 댓글 수정 대화상자 */}
      <Dialog open={showEditCommentDialog} onOpenChange={setShowEditCommentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>댓글 수정</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="댓글 내용"
              value={selectedComment?.body || ""}
              onChange={(e) => setSelectedComment((prev) => (prev ? { ...prev, body: e.target.value } : null))}
            />
            <Button onClick={handleUpdateComment} disabled={updateComment.isPending}>
              {updateComment.isPending ? "업데이트 중..." : "댓글 업데이트"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 게시물 상세 보기 대화상자 */}
      <PostDetailDialog
        post={selectedPost}
        open={showPostDetailDialog}
        onOpenChange={setShowPostDetailDialog}
        searchQuery={searchQuery}
        onAddComment={handleOpenAddComment}
        onEditComment={handleEditComment}
      />

      {/* 사용자 모달 */}
      <UserModal userId={selectedUserId} open={showUserModal} onOpenChange={setShowUserModal} />
    </Card>
  )
}

export default PostsManagerPage
