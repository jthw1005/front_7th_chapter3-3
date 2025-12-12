## 과제 체크포인트

### 기본과제

#### 목표 : 전역상태관리를 이용한 적절한 분리와 계층에 대한 이해를 통한 FSD 폴더 구조 적용하기
- 전역상태관리를 사용해서 상태를 분리하고 관리하는 방법에 대한 이해
- Context API, Jotai, Zustand 등 상태관리 라이브러리 사용하기
- FSD(Feature-Sliced Design)에 대한 이해
- FSD를 통한 관심사의 분리에 대한 이해
- 단일책임과 역할이란 무엇인가?
- 관심사를 하나만 가지고 있는가?
- 어디에 무엇을 넣어야 하는가?

#### 체크포인트
- [x] 전역상태관리를 사용해서 상태를 분리하고 관리했나요?
  - Zustand를 사용하여 다이얼로그 상태(useDialogStore)와 필터 상태(usePostFilterStore) 관리
- [x] Props Drilling을 최소화했나요?
  - Zustand store를 통해 깊은 계층의 props 전달 제거
  - 다이얼로그 열기/닫기 액션을 직접 호출
- [x] shared 공통 컴포넌트를 분리했나요?
  - Button, Input, Card, Dialog, Select, Textarea, Table, Pagination 등 공통 UI 컴포넌트 분리 (shared/ui/)
- [x] shared 공통 로직을 분리했나요?
  - highlightText 유틸리티 함수 (shared/lib/)
  - baseApi 공통 API 설정 (shared/api/)
  - Zustand stores (shared/model/)
- [x] entities를 중심으로 type을 정의하고 model을 분리했나요?
  - Post, Comment, Tag, User 타입 정의 (entities/*/model/types.ts)
- [x] entities를 중심으로 ui를 분리했나요?
  - 현재 entities는 데이터 중심이므로 UI 없음 (FSD 원칙에 부합)
- [x] entities를 중심으로 api를 분리했나요?
  - postApi, commentApi, tagApi, userApi 및 각 queries 파일 분리 (entities/*/api/)
- [x] feature를 중심으로 사용자행동(이벤트 처리)를 분리했나요?
  - post: create, update, delete, search, filter
  - comment: create, update, delete, like
- [x] feature를 중심으로 ui를 분리했나요?
  - PostAddDialog, PostEditDialog, CommentAddDialog, CommentEditDialog, SearchBar, FilterControls
- [x] feature를 중심으로 api를 분리했나요?
  - useCreatePost, useUpdatePost, useDeletePost
  - useCreateComment, useUpdateComment, useDeleteComment, useLikeComment
- [x] widget을 중심으로 데이터를 재사용가능한 형태로 분리했나요?
  - PostTable, PostDetailDialog, UserModal, Header, Footer 위젯 분리


### 심화과제

#### 목표: 서버상태관리 도구인 TanstackQuery를 이용하여 비동기코드를 선언적인 함수형 프로그래밍으로 작성하기 

- TanstackQuery의 사용법에 대한 이해
- TanstackQuery를 이용한 비동기 코드 작성에 대한 이해
- 비동기 코드를 선언적인 함수형 프로그래밍으로 작성하는 방법에 대한 이해

#### 체크포인트

- [x] 모든 API 호출이 TanStack Query의 useQuery와 useMutation으로 대체되었는가?
  - baseApi 계층에서만 fetch 사용, 모든 컴포넌트에서 useQuery/useMutation 사용
  - entities/*/api/에 각 엔티티별 API 함수 및 쿼리 정의
- [x] 쿼리 키가 적절히 설정되었는가?
  - postQueries, commentQueries, userQueries, tagQueries 쿼리 키 팩토리 구현
  - 계층적 구조로 부분 무효화 가능 (예: ["posts", "list"], ["posts", "tag", tag])
- [x] fetch와 useState가 아닌 선언적인 함수형 프로그래밍이 적절히 적용되었는가?
  - 명령형 fetch + useState 패턴 완전 제거
  - useQuery의 data, isLoading, useMutation의 mutate 사용
- [x] 캐싱과 리프레시 전략이 올바르게 구현되었는가?
  - QueryProvider에서 staleTime: 1분, retry: 1 설정
  - 엔티티별 차등 캐싱 (User: 5분, Tag: 10분, Post/Comment: 1분)
  - enabled 옵션으로 불필요한 요청 방지
- [x] 낙관적인 업데이트가 적용되었는가?
  - useDeletePost, useDeleteComment, useLikeComment에 onMutate 구현
  - 에러 시 onError에서 이전 상태로 롤백
  - onSettled에서 서버 데이터로 재검증
- [x] 에러 핸들링이 적절히 구현되었는가?
  - Mutation의 onError에서 캐시 롤백 처리
  - isPending 상태로 버튼 비활성화
  - (개선 필요: UI 레벨 에러 메시지 표시 부재)
- [x] 서버 상태와 클라이언트 상태가 명확히 분리되었는가?
  - TanStack Query: Posts, Comments, Users, Tags (서버 상태)
  - Zustand: Dialog 상태, Filter/Pagination 상태 (클라이언트 상태)
- [x] 코드가 간결하고 유지보수가 용이한 구조로 작성되었는가?
  - 각 feature별로 mutation hook 분리
  - Entity별로 API, queries 분리
  - FSD 구조로 관심사 명확히 분리
- [x] TanStack Query의 Devtools가 정상적으로 작동하는가?
  - QueryProvider.tsx에 ReactQueryDevtools 추가
  - initialIsOpen={false}로 설정하여 필요시 열람 가능


### 최종과제
- [x] 폴더구조와 나의 멘탈모데일이 일치하나요?
  - FSD 계층 구조를 따라 명확히 분리됨
  - app (providers) → pages → widgets → features → entities → shared 순서로 의존성 관리
  - 각 계층의 역할이 명확: entities(데이터), features(사용자 행동), widgets(조합), pages(통합)
- [x] 다른 사람이 봐도 이해하기 쉬운 구조인가요?
  - 각 폴더 이름이 기능/역할을 명확히 표현 (post/create, comment/like)
  - index.ts를 통한 public API로 import 경로 단순화
  - ui, api, model 세그먼트로 관심사 분리
  - 일관된 네이밍 규칙 (useCreatePost, PostAddDialog)

## 과제 셀프회고

### 이번 과제를 통해 이전에 비해 새롭게 알게 된 점이 있다면 적어주세요.

### 본인이 과제를 하면서 가장 애쓰려고 노력했던 부분은 무엇인가요?

### 아직은 막연하다거나 더 고민이 필요한 부분을 적어주세요.

### 이번에 배운 내용 중을 통해 앞으로 개발에 어떻게 적용해보고 싶은지 적어주세요.


## 챕터 셀프회고

> 클린코드와 아키테쳑 챕터 함께 하느라 고생 많으셨습니다!
> 지난 3주간의 여정을 돌이켜 볼 수 있도록 준비해보았습니다.
> 아래에 적힌 질문들은 추억(?)을 회상할 수 있도록 도와주려고 만든 질문이며, 꼭 질문에 대한 대답이 아니어도 좋으니 내가 느꼈던 인사이트들을 자유롭게 적어주세요.

### 클린코드: 읽기 좋고 유지보수하기 좋은 코드 만들기
- 더티코드를 접했을 때 어떤 기분이었나요? ^^; 클린코드의 중요성, 읽기 좋은 코드란 무엇인지, 유지보수하기 쉬운 코드란 무엇인지에 대한 생각을 공유해주세요

### 결합도 낮추기: 디자인 패턴, 순수함수, 컴포넌트 분리, 전역상태 관리
- 거대한 단일 컴포넌트를 봤을때의 느낌! 처음엔 막막했던 상태관리, 디자인 패턴이라는 말이 어렵게만 느껴졌던 시절, 순수함수로 분리하면서 "아하!"했던 순간, 컴포넌트가 독립적이 되어가는 과정에서의 깨달음을 들려주세요

### 응집도 높이기: 서버상태관리, 폴더 구조
- "이 코드는 대체 어디에 둬야 하지?"라고 고민했던 시간, FSD를 적용해보면서의 느낌, 나만의 구조를 만들어가는 과정, TanStack Query로 서버 상태를 분리하면서 느낀 해방감(?)등을 공유해주세요



## 리뷰 받고 싶은 내용이나 궁금한 것에 대한 질문
```