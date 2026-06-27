import { Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography, Divider, useMediaQuery, useTheme } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { NAV_ITEMS } from '../navConfig';
import { usePermissions } from '@/hooks/usePermissions';
import { brand } from '@/theme';
import { APP_NAME } from '@/utils/constants';

const DRAWER_WIDTH = 280;

export default function Sidebar({ open, onClose, collapsed }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const { can } = usePermissions();

  const content = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', background: theme.palette.mode === 'dark' ? '#12141c' : '#fff' }}>
      <Toolbar sx={{ px: 2, minHeight: 72, gap: 1.5 }}>
        <Box
          component="img"
          src="/logo.jpg"
          alt="SGSW logo"
          sx={{
            width: collapsed ? 40 : 44,
            height: collapsed ? 40 : 44,
            objectFit: 'contain',
            borderRadius: '50%',
            flexShrink: 0,
          }}
        />
        {!collapsed && (
          <Box>
            <Typography variant="h6" fontWeight={800} sx={{ background: brand.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {APP_NAME}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Enterprise Admin
            </Typography>
          </Box>
        )}
      </Toolbar>
      <Divider />
      <List sx={{ flex: 1, overflow: 'auto', py: 1 }}>
        {NAV_ITEMS.filter((item) => can(item.module, 'read')).map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
          return (
            <ListItemButton
              key={item.key}
              selected={active}
              onClick={() => {
                navigate(item.path);
                if (isMobile) onClose();
              }}
              sx={{ mx: 1, mb: 0.5, borderRadius: 2 }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <Icon fontSize="small" />
              </ListItemIcon>
              {!collapsed && (
                <ListItemText primary={item.label} slotProps={{ primary: { sx: { fontSize: 14 } } }} />
              )}
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );

  if (isMobile) {
    return (
      <Drawer variant="temporary" open={open} onClose={onClose} ModalProps={{ keepMounted: true }} sx={{ '& .MuiDrawer-paper': { width: DRAWER_WIDTH } }}>
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: collapsed ? 72 : DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: collapsed ? 72 : DRAWER_WIDTH,
          boxSizing: 'border-box',
          transition: 'width 0.2s',
        },
      }}
    >
      {content}
    </Drawer>
  );
}

export { DRAWER_WIDTH };
