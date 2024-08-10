import { pick, debounce } from './common';

describe('pick util 단위테스트', () => {
  it('단일 인자로 전달된 키의 값을 객체에 담아 반환한다', () => {
    const obj = {
      a: 'A',
      b: { c: 'C' },
      d: null,
    };

    expect(pick(obj, 'a')).toEqual({ a: 'A' });
  });

  it('2개 이상의 인자로 전달된 키의 값을 객체에 담아 반환한다', () => {
    const obj = {
      a: 'A',
      b: { c: 'C' },
      d: null,
    };

    expect(pick(obj, 'a', 'b')).toEqual({ a: 'A', b: { c: 'C' } });
  });

  it('대상 객체로 아무 것도 전달 하지 않을 경우 빈 객체가 반환된다', () => {
    expect(pick()).toEqual({});
  });

  it('propNames를 지정하지 않을 경우 빈 객체가 반환된다', () => {
    const obj = {
      a: 'A',
      b: { c: 'C' },
      d: null,
    };

    expect(pick(obj)).toEqual({});
  });
});

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers(); // 타이머 모킹

    // setSystemTime api를 사용하면 시간이 고정되어 일관된 환경에서 테스트 가능
    // 필요한 경우에만 사용
    vi.setSystemTime(new Date('2024-08-10'));
  });

  afterEach(() => {
    vi.useRealTimers(); // 타이머 원래대로 복구
  });

  it('특정 시간이 지난 후 함수가 호출된다', () => {
    const spy = vi.fn();

    const debouncedFn = debounce(spy, 300);

    debouncedFn();

    vi.advanceTimersByTime(300); // 타이머 모킹 후 0.3초 지난 것처럼 세팅

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

    expect(spy).toHaveBeenCalledTimes(1);
  });
});
