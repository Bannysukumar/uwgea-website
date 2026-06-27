import { useState } from 'react';
import { Card, CardContent, TextField, Button, Stack } from '@mui/material';
import { useAppSelector } from '@/redux/hooks';
import { changePassword } from '@/firebase/authService';
import PageHeader from '@/components/common/PageHeader';
import { toast } from 'react-toastify';
import { ROLE_LABELS } from '@/utils/constants';

export default function ProfilePage() {
  const profile = useAppSelector((s) => s.auth.profile);
  const [password, setPassword] = useState('');

  const handlePassword = async () => {
    try {
      await changePassword(password);
      toast.success('Password updated');
      setPassword('');
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <>
      <PageHeader title="Profile" subtitle="Your admin account" />
      <Card>
        <CardContent>
          <Stack spacing={2} maxWidth={400}>
            <TextField label="Name" value={profile?.name || ''} disabled fullWidth />
            <TextField label="Email" value={profile?.email || ''} disabled fullWidth />
            <TextField label="Role" value={ROLE_LABELS[profile?.role] || profile?.role || ''} disabled fullWidth />
            <TextField label="New Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth />
            <Button variant="contained" onClick={handlePassword} disabled={password.length < 6}>
              Change Password
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </>
  );
}
