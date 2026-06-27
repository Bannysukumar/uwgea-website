import { Link as RouterLink } from 'react-router-dom';
import { Typography, Button, Stack, Alert } from '@mui/material';

export default function RegisterPage() {
  return (
    <Stack spacing={2}>
      <Typography variant="h5" fontWeight={700}>
        Member Registration
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Download the SGSW mobile app from Google Play Store to complete membership registration and payment.
      </Typography>
      <Alert severity="info">
        Online member registration via the mobile app creates your account automatically. Admin accounts use the separate login page.
      </Alert>
      <Button component={RouterLink} to="/join-membership" variant="contained">
        View Membership Plans
      </Button>
      <Button component={RouterLink} to="/login" variant="text">
        Admin Login
      </Button>
    </Stack>
  );
}
