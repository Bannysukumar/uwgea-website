import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import PublicHeader from '@/features/public/layout/PublicHeader';
import PublicFooter from '@/features/public/layout/PublicFooter';
import { publicTheme } from '@/features/public/theme/publicTheme';
import { useWebsiteSettings } from '@/features/public/hooks/useWebsiteData';
import { Box, LinearProgress } from '@mui/material';

export default function PublicLayout() {
  const { settings, loading } = useWebsiteSettings();

  useEffect(() => {
    document.title = settings.seo.title;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', settings.seo.description);
  }, [settings.seo.title, settings.seo.description]);

  return (
    <ThemeProvider theme={publicTheme}>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
        {loading && <LinearProgress color="primary" sx={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999 }} />}
        <PublicHeader organization={settings.organization} />
        <Box component="main" sx={{ flexGrow: 1 }}>
          <Outlet context={{ settings }} />
        </Box>
        <PublicFooter settings={settings} />
      </Box>
    </ThemeProvider>
  );
}
