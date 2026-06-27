import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  Container,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  useScrollTrigger,
  Slide,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { PUBLIC_NAV } from '@/features/public/constants/defaults';
import { uwgeaBrand } from '@/features/public/theme/publicTheme';

function HideOnScroll({ children }) {
  const trigger = useScrollTrigger();
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

export default function PublicHeader({ organization }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const logo = organization?.logo_url || '/logo.jpg';

  return (
    <>
      <HideOnScroll>
        <AppBar position="sticky" elevation={2} sx={{ bgcolor: uwgeaBrand.primary }}>
          <Container maxWidth="lg">
            <Toolbar disableGutters sx={{ gap: 2, minHeight: { xs: 64, md: 72 } }}>
              <Box component={RouterLink} to="/" sx={{ display: 'flex', alignItems: 'center', gap: 1.5, textDecoration: 'none', color: 'inherit', flexShrink: 0 }}>
                <Box component="img" src={logo} alt="UWGEA" sx={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.8)' }} />
                <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                  <Box component="span" sx={{ fontWeight: 800, fontSize: '1rem', lineHeight: 1.2 }}>
                    {organization?.name || 'UWGEA'}
                  </Box>
                </Box>
              </Box>

              <Box sx={{ flexGrow: 1, display: { xs: 'none', lg: 'flex' }, justifyContent: 'center', gap: 0.5, flexWrap: 'wrap' }}>
                {PUBLIC_NAV.map((item) => (
                  <Button
                    key={item.path}
                    component={RouterLink}
                    to={item.path}
                    size="small"
                    sx={{
                      color: '#fff',
                      fontWeight: location.pathname === item.path ? 700 : 500,
                      opacity: location.pathname === item.path ? 1 : 0.9,
                      borderBottom: location.pathname === item.path ? '2px solid #FFB300' : '2px solid transparent',
                      borderRadius: 0,
                      px: 1,
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
              </Box>

              <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, flexShrink: 0 }}>
                <Button component={RouterLink} to="/login" variant="outlined" size="small" sx={{ borderColor: '#fff', color: '#fff' }}>
                  Login
                </Button>
                <Button component={RouterLink} to="/register" variant="text" size="small" sx={{ color: '#fff' }}>
                  Register
                </Button>
                <Button component={RouterLink} to="/join-membership" variant="contained" size="small" color="secondary">
                  Join
                </Button>
              </Box>

              <IconButton color="inherit" sx={{ display: { lg: 'none' }, ml: 'auto' }} onClick={() => setOpen(true)}>
                <MenuIcon />
              </IconButton>
            </Toolbar>
          </Container>
        </AppBar>
      </HideOnScroll>

      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <Box sx={{ width: 280, pt: 2 }}>
          <List>
            {PUBLIC_NAV.map((item) => (
              <ListItemButton key={item.path} component={RouterLink} to={item.path} selected={location.pathname === item.path} onClick={() => setOpen(false)}>
                <ListItemText primary={item.label} />
              </ListItemButton>
            ))}
            <ListItemButton component={RouterLink} to="/login" onClick={() => setOpen(false)}>
              <ListItemText primary="Login" />
            </ListItemButton>
            <ListItemButton component={RouterLink} to="/register" onClick={() => setOpen(false)}>
              <ListItemText primary="Register" />
            </ListItemButton>
            <ListItemButton component={RouterLink} to="/grievance" onClick={() => setOpen(false)}>
              <ListItemText primary="Grievance Portal" />
            </ListItemButton>
          </List>
        </Box>
      </Drawer>
    </>
  );
}
