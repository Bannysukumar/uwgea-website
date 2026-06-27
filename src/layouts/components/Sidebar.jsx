import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Toolbar,
  Typography,
  Divider,
  useMediaQuery,
  useTheme,
  Chip,
} from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useNavigate, useLocation } from 'react-router-dom';
import { NAV_SECTIONS } from '../navConfig';
import { usePermissions } from '@/hooks/usePermissions';
import { brand } from '@/theme';
import { APP_NAME } from '@/utils/constants';

const DRAWER_WIDTH = 280;

function NavItem({ item, active, collapsed, onNavigate }) {
  const Icon = item.icon;
  return (
    <ListItemButton
      selected={active}
      onClick={() => onNavigate(item.path)}
      sx={{
        mx: 1,
        mb: 0.25,
        borderRadius: 2,
        py: 0.75,
        '&.Mui-selected': { bgcolor: 'primary.main', color: 'primary.contrastText', '& .MuiListItemIcon-root': { color: 'inherit' } },
      }}
    >
      <ListItemIcon sx={{ minWidth: 36 }}>
        <Icon sx={{ fontSize: 20 }} />
      </ListItemIcon>
      {!collapsed && (
        <ListItemText
          primary={item.label}
          secondary={item.publicPath ? item.publicPath : undefined}
          slotProps={{
            primary: { sx: { fontSize: 13, fontWeight: active ? 600 : 500, lineHeight: 1.3 } },
            secondary: { sx: { fontSize: 10, opacity: 0.65 } },
          }}
        />
      )}
    </ListItemButton>
  );
}

export default function Sidebar({ open, onClose, collapsed }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const { can } = usePermissions();

  const handleNavigate = (path) => {
    navigate(path);
    if (isMobile) onClose();
  };

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(`${path}/`);

  const visibleSections = NAV_SECTIONS.map((section) => ({
    ...section,
    items: section.items.filter((item) => can(item.module, 'read')),
  })).filter((section) => section.items.length > 0);

  const content = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', background: theme.palette.mode === 'dark' ? '#12141c' : '#fff' }}>
      <Toolbar sx={{ px: 2, minHeight: 72, gap: 1.5 }}>
        <Box
          component="img"
          src="/logo.jpg"
          alt="UWGEA logo"
          sx={{
            width: collapsed ? 40 : 44,
            height: collapsed ? 40 : 44,
            objectFit: 'cover',
            borderRadius: '50%',
            flexShrink: 0,
            border: '2px solid',
            borderColor: 'divider',
          }}
        />
        {!collapsed && (
          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="subtitle1"
              fontWeight={800}
              noWrap
              sx={{ background: brand.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
            >
              {APP_NAME}
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block">
              Website + App Admin
            </Typography>
          </Box>
        )}
      </Toolbar>

      {!collapsed && (
        <Box sx={{ px: 2, pb: 1 }}>
          <Chip
            size="small"
            icon={<OpenInNewIcon sx={{ fontSize: '14px !important' }} />}
            label="View public site"
            component="a"
            href="/"
            target="_blank"
            clickable
            variant="outlined"
            color="primary"
            sx={{ width: '100%', justifyContent: 'flex-start' }}
          />
        </Box>
      )}

      <Divider />

      <List sx={{ flex: 1, overflow: 'auto', py: 1 }}>
        {visibleSections.map((section, sectionIndex) => (
          <Box key={section.id} component="li" sx={{ listStyle: 'none' }}>
            {sectionIndex > 0 && <Divider sx={{ my: 1, mx: 2 }} />}
            {!collapsed ? (
              <ListSubheader
                component="div"
                disableSticky
                sx={{
                  bgcolor: 'transparent',
                  lineHeight: 1.4,
                  py: 1,
                  px: 2,
                  fontWeight: 800,
                  fontSize: 11,
                  letterSpacing: 0.8,
                  textTransform: 'uppercase',
                  color: section.id === 'website' ? 'primary.main' : section.id === 'app' ? 'secondary.main' : 'text.secondary',
                }}
              >
                {section.label}
              </ListSubheader>
            ) : (
              sectionIndex > 0 && <Box sx={{ height: 8 }} />
            )}
            {section.items.map((item) => (
              <NavItem
                key={item.key}
                item={item}
                active={isActive(item.path)}
                collapsed={collapsed}
                onNavigate={handleNavigate}
              />
            ))}
          </Box>
        ))}
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
