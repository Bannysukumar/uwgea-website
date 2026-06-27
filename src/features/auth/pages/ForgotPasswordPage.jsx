import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { TextField, Button, Stack, Link, Alert } from '@mui/material';
import { resetPassword } from '@/firebase/authService';

const schema = yup.object({
  email: yup.string().email().required(),
});

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async ({ email }) => {
    try {
      await resetPassword(email);
      setSent(true);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2}>
        {sent ? (
          <Alert severity="success">Password reset email sent. Check your inbox.</Alert>
        ) : (
          <TextField label="Email" {...register('email')} error={!!errors.email} helperText={errors.email?.message} />
        )}
        {error && <Alert severity="error">{error}</Alert>}
        {!sent && <Button type="submit" variant="contained">Send Reset Link</Button>}
        <Link component={RouterLink} to="/login">Back to login</Link>
      </Stack>
    </form>
  );
}
