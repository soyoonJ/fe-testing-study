# 섹션4

## zustand set, setState

https://ui.toast.com/posts/ko_20210812

```jsx
import Cookies from 'js-cookie';
import { create } from 'zustand';

export const useUserStore = create(set => ({
  isLogin: Cookies.get('access_token'),
  user: null,
  setIsLogin: isLogin => set(state => ({ ...state, isLogin })),
  setUserData: user => set(state => ({ ...state, user })),
}));
```

```jsx
import { useCartStore } from '@/store/cart';
import { useFilterStore } from '@/store/filter';
import { useUserStore } from '@/store/user';

const mockStore = (hook, state) => {
  const initStore = hook.getState();
  hook.setState({ ...initStore, ...state }, true);
};

export const mockUseUserStore = state => {
  mockStore(useUserStore, state);
};
```

## within

https://testing-library.com/docs/dom-testing-library/api-within/

```jsx
import {render, within} from '@testing-library/react'

const {getByText} = render(<MyComponent />)
const messages = getByText('messages')
const helloMessage = within(messages).getByText('hello')
```

## queryClient → queries retry

```jsx
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // ✅ turns retries off : 테스트 환경에서는 retry 하지 않도록 false로 설정하는 것이 좋음
        retry: false,
      },
    },
    logger: {
      log: console.log,
      warn: console.warn,
      // ✅ no more errors on the console for tests
      error: process.env.NODE_ENV === 'test' ? () => {} : console.error,
    },
  });
```

## msw

```jsx
import { setupServer } from 'msw/node';
import '@testing-library/jest-dom';

import { handlers } from '@/__mocks__/handlers';

/* msw */
// msw를 사용하여 테스트 환경에서 API 요청을 가로채서 응답을 제어할 수 있음
export const server = setupServer(...handlers);

beforeAll(() => {
  server.listen();
});

afterEach(() => {
  server.resetHandlers(); // 런타임 중에 요청하는 모든 핸들러를 초기화
  vi.clearAllMocks();
});

afterAll(() => {
  vi.resetAllMocks();
  server.close();
});

vi.mock('zustand');

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

```jsx
import { rest } from 'msw';

import response from '@/__mocks__/response';
import { apiRoutes } from '@/apiRoutes';

const API_DOMAIN = 'http://localhost:3000';

export const handlers = [
  ...[
    apiRoutes.users,
    apiRoutes.product,
    apiRoutes.categories,
    apiRoutes.couponList,
  ].map(path =>
    rest.get(`${API_DOMAIN}${path}`, (_, res, ctx) =>
      res(ctx.status(200), ctx.json(response[path])),
    ),
  ),
  rest.get(`${API_DOMAIN}${apiRoutes.products}`, (req, res, ctx) => {
    const data = response[apiRoutes.products];
    const offset = Number(req.url.searchParams.get('offset'));
    const limit = Number(req.url.searchParams.get('limit'));
    const products = data.products.filter(
      (_, index) => index >= offset && index < offset + limit,
    );

    return res(
      ctx.status(200),
      ctx.json({ products, lastPage: data.products.length <= offset + limit }),
    );
  }),
  rest.get(`${API_DOMAIN}${apiRoutes.profile}`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(null));
  }),
  rest.post(`${API_DOMAIN}${apiRoutes.users}`, (req, res, ctx) => {
    if (req.body.name === 'FAIL') {
      return res(ctx.status(500));
    }

    return res(ctx.status(200));
  }),
  rest.post(`${API_DOMAIN}${apiRoutes.login}`, (req, res, ctx) => {
    if (req.body.email === 'FAIL@gmail.com') {
      return res(ctx.status(401));
    }

    return res(
      ctx.status(200),
      ctx.json({
        access_token: 'access_token',
      }),
    );
  }),
  rest.post(`${API_DOMAIN}${apiRoutes.log}`, (_, res, ctx) => {
    return res(ctx.status(200));
  }),
];

```