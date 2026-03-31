import { useState } from 'react';
import { authAPI } from '../../services/api.js';
import { getErrorMessage } from '../utils.js';

export function useLoginForm(onSuccess) {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [authError, setAuthError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const handleLogin = async () => {
    setAuthError('');
    setLoginLoading(true);
    
    if (!loginEmail.trim() || !loginPass.trim()) {
      setAuthError('Please fill in all fields.');
      setLoginLoading(false);
      return;
    }

    try {
      const response = await authAPI.login(loginEmail, loginPass);
      
      // Store the JWT token
      localStorage.setItem('authToken', response.access_token);
      localStorage.setItem('user', JSON.stringify(response.user || { email: loginEmail }));
      
      onSuccess?.();
      
    } catch (error) {
      console.error('Login failed:', error);
      const userMessage = getErrorMessage(error, 'login');
      setAuthError(userMessage);
    } finally {
      setLoginLoading(false);
    }
  };

  return {
    loginEmail,
    setLoginEmail,
    loginPass,
    setLoginPass,
    authError,
    setAuthError,
    loginLoading,
    handleLogin,
  };
}
