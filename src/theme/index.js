import { createTheme } from '@mui/material/styles';

const brand = {
  primary: '#5B4CFF',
  secondary: '#00C9A7',
  gradient: 'linear-gradient(135deg, #5B4CFF 0%, #00C9A7 100%)',
};

export const getTheme = (darkMode) =>
  createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: { main: brand.primary },
      secondary: { main: brand.secondary },
      background: {
        default: darkMode ? '#0f1117' : '#f4f6fb',
        paper: darkMode ? '#1a1d27' : '#ffffff',
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h4: { fontWeight: 700 },
      h5: { fontWeight: 600 },
    },
    shape: { borderRadius: 12 },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            backdropFilter: 'blur(8px)',
            border: darkMode ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)',
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            borderRight: 'none',
          },
        },
      },
    },
  });

export { brand };
