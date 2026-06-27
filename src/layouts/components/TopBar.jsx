import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Avatar,
  Menu,
  MenuItem,
  TextField,
  InputAdornment,
  Tooltip,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import SearchIcon from '@mui/icons-material/Search';
import LogoutIcon from '@mui/icons-material/Logout';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { toggleDarkMode, setGlobalSearch } from '@/redux/slices/uiSlice';
import { signOutUser } from '@/redux/slices/authSlice';
import { ROLE_LABELS } from '@/utils/constants';

export default function TopBar({ onMenuClick, collapsed, onToggleCollapse }) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const profile = useAppSelector((s) => s.auth.profile);
  const darkMode = useAppSelector((s) => s.ui.darkMode);
  const globalSearch = useAppSelector((s) => s.ui.globalSearch);
  const [anchor, setAnchor] = useState(null);

  const handleLogout = async () => {
    setAnchor(null);
    await dispatch(signOutUser());
    navigate('/login');
  };

  return (
    <AppBar position="sticky" elevation={0} color="inherit" sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Toolbar>
        <IconButton edge="start" onClick={onMenuClick} sx={{ mr: 1, display: { md: 'none' } }}>
          <MenuIcon />
        </IconButton>
        <IconButton onClick={onToggleCollapse} sx={{ mr: 1, display: { xs: 'none', md: 'inline-flex' } }}>
          {collapsed ? <MenuIcon /> : <MenuOpenIcon />}
        </IconButton>

        <TextField
          size="small"
          placeholder="Global search…"
          value={globalSearch}
          onChange={(e) => dispatch(setGlobalSearch(e.target.value))}
          sx={{ width: { xs: 140, sm: 280 }, mr: 2 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
        />

        <Box sx={{ flexGrow: 1 }} />

        <Tooltip title="Toggle theme">
          <IconButton onClick={() => dispatch(toggleDarkMode())}>
            {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Tooltip>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 1, cursor: 'pointer' }} onClick={(e) => setAnchor(e.currentTarget)}>
          <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main' }}>
            {(profile?.name || profile?.email || 'A')[0].toUpperCase()}
          </Avatar>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            <Typography variant="body2" fontWeight={600}>
              {profile?.name || 'Admin'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {ROLE_LABELS[profile?.role] || profile?.role}
            </Typography>
          </Box>
        </Box>

        <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}>
          <MenuItem onClick={() => { setAnchor(null); navigate('/profile'); }}>Profile</MenuItem>
          <MenuItem onClick={handleLogout}>
            <LogoutIcon fontSize="small" sx={{ mr: 1 }} /> Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
