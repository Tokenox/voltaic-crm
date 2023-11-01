import React, { useState } from 'react';
import axios from 'axios';
import { Checkbox, FormControlLabel, IconButton, InputAdornment, Stack, TextField } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';
import AuthenticationLayout from '../layouts/AuthenticationLayout';
import Iconify from '../components/iconify';
import CustomInput from '../components/input/CustomInput';
import { useAppDispatch } from '../hooks/hooks';
import { login } from '../redux/middleware/authentication';

const LoginPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleClick = async () => {
    try {
      if (!email || !password) return alert('Please fill in all fields');
      await dispatch(login({ email, password }));
      navigate('/dashboard/deals', { replace: true });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <AuthenticationLayout title="Login" link={{ text: 'Register', to: '/register' }}>
      <Stack spacing={3}>
        <CustomInput value={email} onChange={(e) => setEmail(e.target.value)} name="email" label="Email address" />
        <TextField
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        <FormControlLabel value="remember" control={<Checkbox />} label="Remember me" labelPlacement="end" />
        <Link to="/verify-email">Forgot password?</Link>
      </Stack>

      <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleClick}>
        Login
      </LoadingButton>
    </AuthenticationLayout>
  );
};

export default LoginPage;
