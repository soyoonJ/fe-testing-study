/** @type { import('@storybook/react').Preview } */
import { withRouter } from 'storybook-addon-react-router-v6';
import { CssBaseline } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { initialize, mswDecorator } from 'msw-storybook-addon';

import { handlers } from '../src/__mocks__/handlers';
import withRHF from './withRHF';

import 'swiper/css';
import 'swiper/css/navigation';

const queryClient = new QueryClient();
initialize({
  onUnhandledRequest: 'bypass',
});

const preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: { // storybook의 컨트롤 탭에서 변경 시 화면에 반영
      expanded: true,
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    msw: {
      handlers,
    },
  },
  decorators: [
    withRouter, // react-router
    mswDecorator, // msw
    withRHF(false), // react-hook-form
    Story => (
      <QueryClientProvider client={queryClient}>
        <CssBaseline />
        <Story />
      </QueryClientProvider>
    ),
  ],
};

export default preview;
