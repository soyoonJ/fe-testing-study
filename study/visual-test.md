# 섹션6

## storybook

### CSF (Component Story Format)

### play

assertion을 작성해 테스트 가능

동작을 시뮬레이션하는 목적으로 플레이 함수 사용하고 있음

storybook/addon-interactions를 설치해야 사용 가능

복잡한 비즈니스 로직이 있는 컴포넌트를 테스트하기보다는 props를 받아 UI만 렌더링하는 컴포넌트에서 사용하는 것이 좋음

## 시각적 회귀 테스트

### 전문 도구 사용

**Chromatic**, Applitools, BackstopJS와 같은 도구를 사용하여 스냅샷을 만들고 검증하는 것이 좋음

https://www.chromatic.com/setup?appId=66d405acbc170873b7d719df

- Chromatic : 스토리북 메인테이너들이 만든 시각적 회귀 테스트 도구
- 처음에 올리고 난 후 수정하면 스냅샷 기준으로 비교 후 변경사항 알려줌
- 변경사항 확인을 위해 이전까지 커밋된 상태여야 함

### 한계

- 대부분의 툴 유료로 부담일 수 있음
- UI만을 확인하기 때문에 이슈의 원인을 파악하는 데 오랜 시간이 걸림
- TDD가 불가하고 개발이 어느정도 마무리된 시점에 사용해야 함