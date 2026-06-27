import { Box, Container, Paper, Typography } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { APP_NAME } from '@/utils/constants';
import { brand } from '@/theme';
import { motion } from 'framer-motion';

export default function AuthLayout() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f1117 0%, #1a1d3a 50%, #0d3b35 100%)',
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <Box
              component="img"
              src="/logo.jpg"
              alt="SGSW logo"
              sx={{ width: 120, height: 120, objectFit: 'contain', borderRadius: '50%' }}
            />
          </Box>
          <Typography variant="h4" align="center" fontWeight={800} sx={{ mb: 1, color: '#fff' }}>
            {APP_NAME}
          </Typography>
          <Typography align="center" sx={{ mb: 3, color: 'rgba(255,255,255,0.7)' }}>
            Enterprise control panel for SGSW Android app
          </Typography>
          <Paper elevation={8} sx={{ p: 4, borderRadius: 3, borderTop: `4px solid`, borderImage: `${brand.gradient} 1` }}>
            <Outlet />
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
}
