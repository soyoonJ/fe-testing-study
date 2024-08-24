import React from 'react';

import PageTitle from '@/pages/cart/components/PageTitle';
import render from '@/utils/test/render';

// 테스트 실행 후 의도한 내용이라면 터미널에서 u를 입력하여 스냅샷을 업데이트할 수 있음
it('pageTitle 스냅샷 테스트(toMatchInlineSnapshot)', async () => {
  const { container } = await render(<PageTitle />);

  // toMatchInlineSnapshot까지만 입력 후 테스트를 실행하면 스냅샷이 생성됨
  expect(container).toMatchInlineSnapshot(`
    <div>
      <h2
        class="MuiTypography-root MuiTypography-h4 css-1lnl64-MuiTypography-root"
      >
        상품 리스트
      </h2>
      <div
        style="position: fixed; z-index: 9999; top: 16px; left: 16px; right: 16px; bottom: 16px; pointer-events: none;"
      />
    </div>
  `);
});

it('pageTitle 스냅샷 테스트(toMatchSnapshot)', async () => {
  const { container } = await render(<PageTitle />);

  // 테스트 실행하면 별도 파일로 스냅샷이 생성됨
  expect(container).toMatchSnapshot();
});
