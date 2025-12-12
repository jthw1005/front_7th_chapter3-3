# Slice

FSD의 두 번째 계층입니다.
주 목적은 제품, 비즈니스, 또는 단순히 애플리케이션 관점에서 관련 있는 코드를 하나로 묶는 것입니다.

### Slice의 Public API 규칙

Slice 내부 구조는 팀이 원하는 방식대로 자유롭게 구성할 수 있습니다.
단, 다른 Slice가 사용할 수 있도록 명확한 Public API를 반드시 제공해야 합니다.
이 규칙은 Slice Public API Rule로 강제됩니다.

모든 Slice(또는 Slice가 없는 Layer의 Segment)는 Public API를 정의해야 합니다.
외부 모듈은 Slice/Segment의 내부 구조가 아니라 Public API를 통해서만 접근할 수 있습니다.

Public API의 목적과 작성 방법은 Public API Reference에서 자세히 설명합니다.

### Slice Group

연관성이 높은 Slice는 폴더로 묶어서 관리할 수 있습니다.
단, 다른 Slice와 동일하게 격리 규칙을 적용해야 하며, 그룹 내부에서도 코드 공유는 불가능합니다.
