# 섹션 2. 단위 테스트

단위 테스트

테스트는 순서에 상관없이 독립적으로 실행되어 결과를 보장할 수 있어야 한다.

## 테스트 작성 기법

- Arrange-Act-Assert
  - Arrange : 테스트를 위한 환경 만들기
  - Act : 테스트할 동작 발생
  - Assert : 올바른 동작이 실행 되었는지 or 변경사항 검증

## React-testing-library

jsdom 구조 확인 가능

```jsx
screen.debug();
```

## setup, teardown

- setup : 테스트 실행 전
- teardown : 테스트 실행 후

beforeEach를 describe 안에 넣을 경우 해당 describe 블럭 안에서만 실행 됨

beforeAll → beforeEach → afterEach → afterAll

- beforeEach는 모든 테스트에서 동작 (describe에서는 그 안에 있는 것만 실행되는 것이 아니라 밖에 있는 beforeEach도 실행됨)
- setup, teardown 사용 시에는 전역 변수를 이용한 조건부 사용하지 않기 → 독립적인 테스트가 보장되지 않음

전역으로 세팅하고 싶을 경우 setupFiles를 사용하기

```jsx
import path from 'path';

import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint';
import { defineConfig } from 'vitest/config';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), eslint({ exclude: ['/virtual:/**', 'node_modules/**'] })],
  test: {
    globals: true, // vitest에서 제공하는 API들을 별도의 import 없이 사용 가능
    environment: 'jsdom',
    setupFiles: './src/utils/test/setupTests.js',
  },
  resolve: {
    alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
  },
});
```

```jsx
import '@testing-library/jest-dom';

afterEach(() => {
  vi.clearAllMocks();
});

afterAll(() => {
  vi.resetAllMocks();
});

// https://github.com/vitest-dev/vitest/issues/821
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
```

### _순서 이슈 → beforeAll이 afterAll 직전에 실행됨_

- beforeAll 순서 잘라내서 바꾸면 처음에는 제대로 동작하나 싶다가 갑자기 또 저장하면 순서가 이상하게 되어있음

```jsx
import { screen } from '@testing-library/react';
import React from 'react';

import TextField from '@/components/TextField';
import render from '@/utils/test/render';

beforeAll(() => {
  console.log('root - beforeAll');
});
beforeEach(() => {
  console.log('root - beforeEach');
});

afterEach(() => {
  console.log('root - afterEach');
});
afterAll(() => {
  console.log('root - afterAll');
});

it('className prop으로 설정한 css class가 적용된다.', async () => {
  await render(<TextField className="my-class" />);

  const textInput = screen.getByPlaceholderText('텍스트를 입력해 주세요.');

  screen.debug();

  expect(textInput).toHaveClass('my-class');
});

describe('placeholder', () => {
  beforeEach(() => {
    console.log('describe - beforeEach');
  });
  it('기본 placeholder "텍스트를 입력해주세요."가 노출된다.', async () => {
    await render(<TextField />);

    const textInput = screen.getByPlaceholderText('텍스트를 입력해 주세요.');

    expect(textInput).toBeInTheDocument(); // jest-dom library에 있음
  });

  it('placeholder prop에 따라 placeholder가 변경된다.', async () => {
    await render(<TextField placeholder="상품명을 입력해주세요." />);

    const textInput = screen.getByPlaceholderText('상품명을 입력해주세요.');

    expect(textInput).toBeInTheDocument(); // jest-dom library에 있음
  });
});
```

## 최종 코드

```jsx
import { screen } from '@testing-library/react';
import React from 'react';

import TextField from '@/components/TextField';
import render from '@/utils/test/render';

// beforeEach(async () => {
//   await render(<TextField className="my-class" />);
// });
it('className prop으로 설정한 css class가 적용된다.', async () => {
  await render(<TextField className="my-class" />);

  const textInput = screen.getByPlaceholderText('텍스트를 입력해 주세요.');

  screen.debug();

  expect(textInput).toHaveClass('my-class');
});

describe('placeholder', () => {
  beforeEach(() => {
    console.log('describe - beforeEach');
  });
  it('기본 placeholder "텍스트를 입력해주세요."가 노출된다.', async () => {
    await render(<TextField />);

    const textInput = screen.getByPlaceholderText('텍스트를 입력해 주세요.');

    expect(textInput).toBeInTheDocument(); // jest-dom library에 있음
  });

  it('placeholder prop에 따라 placeholder가 변경된다.', async () => {
    await render(<TextField placeholder="상품명을 입력해주세요." />);

    const textInput = screen.getByPlaceholderText('상품명을 입력해주세요.');

    expect(textInput).toBeInTheDocument(); // jest-dom library에 있음
  });
});

it('텍스트를 입력하면 onChange prop으로 등록한 함수가 호출된다.', async () => {
  const spy = vi.fn();
  const { user } = await render(<TextField onChange={spy} />);

  const textInput = screen.getByPlaceholderText('텍스트를 입력해 주세요.');

  await user.type(textInput, 'test');

  expect(spy).toBeCalledWith('test');
});

it('엔터키를 입력하면 onEnter prop으로 등록한 함수가 호출된다.', async () => {
  const spy = vi.fn();
  const { user } = await render(<TextField onEnter={spy} />);

  const textInput = screen.getByPlaceholderText('텍스트를 입력해 주세요.');

  await user.type(textInput, 'test{Enter}');

  expect(spy).toBeCalledWith('test');
});

it('포커스가 활성화되면 onFocus prop으로 등록한 함수가 호출된다.', async () => {
  const spy = vi.fn();
  const { user } = await render(<TextField onFocus={spy} />);

  const textInput = screen.getByPlaceholderText('텍스트를 입력해 주세요.');

  await user.click(textInput);

  expect(spy).toHaveBeenCalled();
});

it('포커스가 활성화되면 border 스타일이 추가된다.', async () => {
  const { user } = await render(<TextField />);

  const textInput = screen.getByPlaceholderText('텍스트를 입력해 주세요.');

  await user.click(textInput);

  expect(textInput).toHaveStyle({
    borderWidth: 2,
    borderColor: 'rgb(25, 118, 210)',
  });
});
```
