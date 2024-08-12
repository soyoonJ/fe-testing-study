# 섹션3

## react-router-dom navigate mocking

```jsx
**const navigateFn = vi.fn();
vi.mock('react-router-dom', async () => {
  const original = await vi.importActual('react-router-dom');
  return { ...original, useNavigate: () => navigateFn };
});**

it('Home으로 이동 버튼 클릭시 홈 경로로 이동하는 navigate가 실행된다', async () => {
  const { user } = await render(<NotFoundPage />);

  const button = await screen.getByRole('button', { name: 'Home으로 이동' });

  await user.click(button);

  **expect(navigateFn).toHaveBeenNthCalledWith(1, '/', { replace: true });**
});
```

## reset mocking

```jsx
afterEach(() => {
  server.resetHandlers();
  vi.clearAllMocks();
});

afterAll(() => {
  vi.resetAllMocks();
  server.close();
});
```

## react hook test

```jsx
it('호출 시 initialValue 인자를 boolean 값으로 지정하는 경우 해당 값으로 isModalOpened 상태가 설정된다.', () => {
  const { result } = renderHook(() => useConfirmModal(true));

  expect(result.current.isModalOpened).toBe(true);
});
```

## act()

render 함수와 user-event는 내부적으로 act 함수를 호출하기 때문에 업데이트 후의 결과값을 바로 호출할 수 있음.

자체적으로 리액트 state를 업데이트 해야 하는 경우에는 act 함수를 사용하여 state 업데이트를 반영한 후 값을 검증해야 함

```jsx
it('훅의 toggleIsModalOpened()를 호출하면 isModalOpened 상태가 toggle된다.', () => {
  const { result } = renderHook(useConfirmModal);

  expect(result.current.isModalOpened).toBe(false);

  **act(() => {
    result.current.toggleIsModalOpened();
  });**

  expect(result.current.isModalOpened).toBe(true);
});
```

## timer 테스트

```jsx
describe('debounce', () => {
  beforeEach(() => {
    **vi.useFakeTimers(); // 타이머 모킹**

    // setSystemTime api를 사용하면 시간이 고정되어 일관된 환경에서 테스트 가능
    // 필요한 경우에만 사용
    **vi.setSystemTime(new Date('2024-08-10'));**
  });

  afterEach(() => {
    **vi.useRealTimers(); // 타이머 원래대로 복구**
  });

  it('특정 시간이 지난 후 함수가 호출된다', () => {
    const spy = vi.fn();

    const debouncedFn = debounce(spy, 300);

    debouncedFn();

    **vi.advanceTimersByTime(300); // 타이머 모킹 후 0.3초 지난 것처럼 세팅**

    expect(spy).toHaveBeenCalled();
  });

  it('연이어 호출해도 마지막 호출 기준으로 지정된 타이머 시간이 지난 경우에만 함수가 호출된다.', () => {
    const spy = vi.fn();

    const debouncedFn = debounce(spy, 300);

    debouncedFn();
    vi.advanceTimersByTime(200);

    debouncedFn();
    vi.advanceTimersByTime(100);

    debouncedFn();
    vi.advanceTimersByTime(200);

    debouncedFn();
    vi.advanceTimersByTime(300); // 유일한 0.3초 후 호출

		// 0.3초 후 호출된 경우는 1번이 유일하기 때문에 spy가 1번만 호출되는 것으로 테스트
    **expect(spy).toHaveBeenCalledTimes(1);**
  });
});

```

## fireEvent, userEvent

fireEvent는 단순히 click 이벤트만 발생시킨다. ⇒ mouse event 같은 것

연쇄적인 요소에 대해서는 확인하지 않음

userEvent는 연쇄적인 부분까지 고려하기 때문에 실제 상황과 더 밀접함.

실제 현업에서도 userEvent를 더 권장함.

**대부분의 경우에는 fireEvent를 사용. 다만 scroll event와 같이 userEvent에서 제공되지 않는 부분이나 단순히 컴포넌트 검증일 경우에는 fireEvent를 사용**
