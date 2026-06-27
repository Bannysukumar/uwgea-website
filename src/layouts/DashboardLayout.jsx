import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Toolbar } from '@mui/material';
import Sidebar, { DRAWER_WIDTH } from './components/Sidebar';
import TopBar from './components/TopBar';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { toggleSidebar, setSidebarCollapsed } from '@/redux/slices/uiSlice';
import { touchActivity } from '@/redux/slices/authSlice';
import { useEffect } from 'react';

export default function DashboardLayout() {
  const dispatch = useAppDispatch();
  const sidebarOpen = useAppSelector((s) => s.ui.sidebarOpen);
  const collapsed = useAppSelector((s) => s.ui.sidebarCollapsed);

  useEffect(() => {
    const onActivity = () => dispatch(touchActivity());
    window.addEventListener('click', onActivity);
    window.addEventListener('keydown', onActivity);
    return () => {
      window.removeEventListener('click', onActivity);
      window.removeEventListener('keydown', onActivity);
    };
  }, [dispatch]);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar open={sidebarOpen} onClose={() => dispatch(toggleSidebar())} collapsed={collapsed} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${collapsed ? 72 : DRAWER_WIDTH}px)` },
          bgcolor: 'background.default',
        }}
      >
        <TopBar
          onMenuClick={() => dispatch(toggleSidebar())}
          collapsed={collapsed}
          onToggleCollapse={() => dispatch(setSidebarCollapsed(!collapsed))}
        />
        <Toolbar />
        <Box sx={{ p: { xs: 2, md: 3 } }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
