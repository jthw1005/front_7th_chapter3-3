import { useEffect, useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Plus } from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"
import { Button, Card, CardContent, CardHeader, CardTitle, Pagination } from "@/shared/ui"
import { useDialogStore, usePostFilterStore } from "@/shared/model"
import { postQueries } from "@/entities/post"
import { userQueries } from "@/entities/user"
import { tagQueries } from "@/entities/tag"
import { type PostWithAuthor } from "@/entities/post"
import { useDeletePost } from "@/features/post"
import { SearchBar } from "@/features/post/search"
import { FilterControls } from "@/features/post/filter"
import { PostAddDialog } from "@/features/post/create"
import { PostEditDialog } from "@/features/post/update"
import { CommentAddDialog } from "@/features/comment/create"
import { CommentEditDialog } from "@/features/comment/update"
import { PostTable } from "@/widgets/post-table"
import { PostDetailDialog } from "@/widgets/post-detail-dialog"
import { UserModal } from "@/widgets/user-modal"

const PostsManagerPage = () => {
  const navigate = useNavigate()
  const location = useLocation()

  // Zustand stores
  const {
    showAddPostDialog,
    showEditPostDialog,
    showPostDetailDialog,
    showAddCommentDialog,
    showEditCommentDialog,
    showUserModal,
    selectedPost,
    selectedUserId,
    selectedComment,
    commentPostId,
    openAddPostDialog,
    closeAddPostDialog,
    openEditPostDialog,
    closeEditPostDialog,
    openPostDetailDialog,
    closePostDetailDialog,
    openAddCommentDialog,
    closeAddCommentDialog,
    openEditCommentDialog,
    closeEditCommentDialog,
    openUserModal,
    closeUserModal,
  } = useDialogStore()

  const { skip, limit, searchQuery, sortBy, sortOrder, selectedTag, setFilters, initFromURL } = usePostFilterStore()

  // 로컬 검색 입력 상태 (성능 최적화 - URL에서 파생)
  const [localSearchQuery, setLocalSearchQuery] = useState(() => {
    const params = new URLSearchParams(location.search)
    return params.get("search") || ""
  })

  // URL과 store 동기화
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    initFromURL(searchParams)
  }, [location.search, initFromURL])

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
  const {
    data: searchData,
    isLoading: isSearchLoading,
    refetch: refetchSearch,
  } = useQuery({
    ...postQueries.search(searchQuery),
    enabled: false, // 수동으로 트리거
  })

  // TanStack Query - 유저 목록
  const { data: usersData } = useQuery(userQueries.list())

  // TanStack Query - 태그 목록
  const { data: tags } = useQuery(tagQueries.list())

  // Mutations
  const deletePost = useDeletePost()

  // 게시물 + 작성자 정보 결합 및 정렬
  const postsWithAuthors = useMemo((): PostWithAuthor[] => {
    const rawPosts = searchData?.posts ?? tagPostsData?.posts ?? postsData?.posts ?? []
    const users = usersData?.users ?? []

    const postsWithAuthor = rawPosts.map((post) => ({
      ...post,
      author: users.find((user) => user.id === post.userId),
    }))

    // 정렬 적용
    return postsWithAuthor.sort((a, b) => {
      let compareValue = 0

      switch (sortBy) {
        case "id":
          compareValue = a.id - b.id
          break
        case "title":
          compareValue = a.title.localeCompare(b.title)
          break
        case "reactions":
          compareValue = a.reactions.likes - b.reactions.likes
          break
        default:
          compareValue = 0
      }

      return sortOrder === "asc" ? compareValue : -compareValue
    })
  }, [postsData, tagPostsData, searchData, usersData, sortBy, sortOrder])

  const total = searchData?.total ?? tagPostsData?.total ?? postsData?.total ?? 0
  const isLoading = isPostsLoading || isTagPostsLoading || isSearchLoading

  // URL 업데이트 및 store 업데이트
  const updateURL = (
    updates: {
      skip?: number
      limit?: number
      searchQuery?: string
      sortBy?: string
      sortOrder?: string
      selectedTag?: string
    } = {},
  ) => {
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

    // store도 업데이트
    setFilters({
      skip: newSkip,
      limit: newLimit,
      searchQuery: newSearchQuery,
      sortBy: newSortBy,
      sortOrder: newSortOrder,
      selectedTag: newSelectedTag,
    })
  }

  // 검색 실행 (Enter 키 또는 검색 버튼 클릭 시)
  const handleSearch = () => {
    if (localSearchQuery) {
      updateURL({ searchQuery: localSearchQuery })
      refetchSearch()
    }
  }

  // 게시물 삭제
  const handleDeletePost = (id: number) => {
    deletePost.mutate(id)
  }

  // 태그 클릭
  const handleTagClick = (tag: string) => {
    updateURL({ selectedTag: tag })
  }

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>게시물 관리자</span>
          <Button onClick={openAddPostDialog}>
            <Plus className="w-4 h-4 mr-2" />
            게시물 추가
          </Button>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col gap-4">
          {/* 검색 및 필터 컨트롤 */}
          <div className="flex gap-4">
            <SearchBar value={localSearchQuery} onChange={setLocalSearchQuery} onSearch={handleSearch} />
            <FilterControls
              selectedTag={selectedTag}
              sortBy={sortBy}
              sortOrder={sortOrder}
              tags={tags || []}
              onTagChange={(value) => updateURL({ selectedTag: value })}
              onSortByChange={(value) => updateURL({ sortBy: value })}
              onSortOrderChange={(value) => updateURL({ sortOrder: value })}
            />
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
              onAuthorClick={openUserModal}
              onDetail={openPostDetailDialog}
              onEdit={openEditPostDialog}
              onDelete={handleDeletePost}
            />
          )}

          {/* 페이지네이션 */}
          <Pagination
            skip={skip}
            limit={limit}
            total={total}
            onSkipChange={(newSkip) => updateURL({ skip: newSkip })}
            onLimitChange={(newLimit) => updateURL({ limit: newLimit })}
          />
        </div>
      </CardContent>

      {/* 게시물 추가 대화상자 */}
      <PostAddDialog open={showAddPostDialog} onOpenChange={(open) => !open && closeAddPostDialog()} />

      {/* 게시물 수정 대화상자 */}
      <PostEditDialog
        open={showEditPostDialog}
        onOpenChange={(open) => !open && closeEditPostDialog()}
        post={selectedPost}
      />

      {/* 댓글 추가 대화상자 */}
      <CommentAddDialog
        open={showAddCommentDialog}
        onOpenChange={(open) => !open && closeAddCommentDialog()}
        postId={commentPostId}
      />

      {/* 댓글 수정 대화상자 */}
      <CommentEditDialog
        open={showEditCommentDialog}
        onOpenChange={(open) => !open && closeEditCommentDialog()}
        comment={selectedComment}
        postId={selectedPost?.id || 0}
      />

      {/* 게시물 상세 보기 대화상자 */}
      <PostDetailDialog
        post={selectedPost}
        open={showPostDetailDialog}
        onOpenChange={(open) => !open && closePostDetailDialog()}
        searchQuery={searchQuery}
        onAddComment={openAddCommentDialog}
        onEditComment={(comment) => openEditCommentDialog(comment, selectedPost?.id || 0)}
      />

      {/* 사용자 모달 */}
      <UserModal userId={selectedUserId} open={showUserModal} onOpenChange={(open) => !open && closeUserModal()} />
    </Card>
  )
}

export default PostsManagerPage
