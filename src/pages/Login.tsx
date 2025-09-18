import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Alert
} from '@mui/material';

import { login } from '../services/apiService'
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password_hash, setPasswordHash] = useState('');
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    async function handleLogin (){
      const userData = {email, password_hash}
      const { error } = await login(userData);
      if(error){
        setError(error);
      }else{
        navigate('/dashboard')
      }
    }
    handleLogin();
  };

  const handleClose = () => {
    setError(null);
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      {error && (
        <Alert severity="error" onClose={handleClose}>
          {error}
        </Alert>
      )}
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Login
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
          />

          <TextField
            label="Password"
            type="password"
            value={password_hash}
            onChange={(e) => setPasswordHash(e.target.value)}
            required
            fullWidth
            inputProps={{ minLength: 6 }}
          />

          <Button type="submit" variant="contained" color="primary" fullWidth onClick={handleSubmit}>
            Log In
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage;