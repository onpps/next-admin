'use client';

import { Suspense } from 'react';
import { ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import ChannelAdminPage from './ChannelAdminPage';

export default function VideoPage() {

  const darkTheme = createTheme({
    palette: {
      mode: 'dark'
    }
  });

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ThemeProvider theme={darkTheme}>
          <ChannelAdminPage />
      </ThemeProvider>
    </Suspense>
  );
}