import { useEffect, useMemo } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { store } from '@/redux/store';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { initAuthListener } from '@/redux/slices/authSlice';
import { getTheme } from '@/theme';
import AppRoutes from '@/routes/AppRoutes';

function AppShell() {
  const dispatch = useAppDispatch();
  const darkMode = useAppSelector((s) => s.ui.darkMode);
  const theme = useMemo(() => getTheme(darkMode), [darkMode]);

  useEffect(() => {
    const unsub = dispatch(initAuthListener());
    return () => unsub?.();
  }, [dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
      <ToastContainer position="top-right" autoClose={4000} theme={darkMode ? 'dark' : 'light'} />
    </ThemeProvider>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AppShell />
    </Provider>
  );
}
