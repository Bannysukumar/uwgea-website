import { createTheme } from '@mui/material/styles';

export const uwgeaBrand = {
  primary: '#B71C1C',
  primaryDark: '#7F0000',
  primaryLight: '#F44336',
  secondary: '#FFB300',
  gradient: 'linear-gradient(135deg, rgba(183,28,28,0.92) 0%, rgba(127,0,0,0.88) 100%)',
  heroOverlay: 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.75) 100%)',
};

export const publicTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: uwgeaBrand.primary, dark: uwgeaBrand.primaryDark, light: uwgeaBrand.primaryLight },
    secondary: { main: uwgeaBrand.secondary },
    background: { default: '#FAFAFA', paper: '#FFFFFF' },
    text: { primary: '#1A1A1A', secondary: '#616161' },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 800, letterSpacing: '-0.02em' },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 10, padding: '10px 22px' },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
          border: '1px solid rgba(0,0,0,0.04)',
        },
      },
    },
  },
});
