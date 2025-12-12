# Segment

FSD 구조에서 세 번째이자 마지막 계층이며, 코드를 기술적 성격에 따라 그룹화합니다.

### 표준 Segment

- ui — UI 관련: Component, Date Formatter, Style 등
- api — Backend 통신: Request Function, Data Type, Mapper 등
- model — Data Model: Schema, Interface, Store, Business Logic
- lib — Slice 내부 Library 코드
- config — Configuration과 Feature Flag

또한 커스텀 Segment를 만들 수 있습니다.
특히 App Layer와 Shared Layer는 Slice가 없기 때문에, 커스텀 Segment가 자주 사용됩니다.

Segment 이름은 내용의 본질(components/hooks/types) 이 아니라 목적을 설명해야 합니다.
예를 들어 components, hooks, types 같은 이름은 찾을 때 도움이 되지 않으므로 피하세요.
