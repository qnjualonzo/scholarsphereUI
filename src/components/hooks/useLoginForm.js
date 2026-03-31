import { useState } from 'react';
import { authAPI } from '../../services/api.js';
import { getErrorMessage } from '../utils.js';
import { TEST_ACCOUNT_STORAGE_KEY, TEST_ACCOUNT_DEFAULTS } from '../constants';

export function useLoginForm(onSuccess) {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [authError, setAuthError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const readTestAccount = () => {
    try {
      const raw = localStorage.getItem(TEST_ACCOUNT_STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  };

  const createTestAccount = () => {
    const testAccount = {
      ...TEST_ACCOUNT_DEFAULTS,
      createdAt: new Date().toISOString(),
      isDisposable: true,
    };

    localStorage.setItem(TEST_ACCOUNT_STORAGE_KEY, JSON.stringify(testAccount));
    setLoginEmail(testAccount.email);
    setLoginPass(testAccount.password);
    setAuthError('Disposable test account created. Click "Use Test Account" to enter.');
    return testAccount;
  };

  const useTestAccountLogin = () => {
    const testAccount = readTestAccount();
    if (!testAccount) {
      setAuthError('No disposable test account found. Create it first.');
      return;
    }

    localStorage.setItem('authToken', 'test-account-token');
    localStorage.setItem('user', JSON.stringify({
      email: testAccount.email,
      first_name: testAccount.firstName,
      last_name: testAccount.lastName,
      is_test_account: true,
    }));

    onSuccess?.();
  };

  const deleteTestAccount = () => {
    localStorage.removeItem(TEST_ACCOUNT_STORAGE_KEY);

    const userRaw = localStorage.getItem('user');
    if (userRaw) {
      try {
        const user = JSON.parse(userRaw);
        if (user?.is_test_account) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
        }
      } catch {
        // no-op
      }
    }

    setAuthError('Disposable test account deleted.');
    setLoginEmail('');
    setLoginPass('');
  };

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
    createTestAccount,
    useTestAccountLogin,
    deleteTestAccount,
    testAccount: readTestAccount(),
  };
}
