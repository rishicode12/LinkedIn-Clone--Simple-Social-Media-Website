import React from 'react';
import { GoogleLogin as GoogleLoginButton } from '@react-oauth/google';
import { apiRequest } from '../../utils/api';
import { useAuth } from '../../context/useAuth';

const GoogleLogin = () => {
    const { login } = useAuth();
    const handleOnSuccess = async (credentialResponse) => {
        try {
          const idToken = credentialResponse?.credential;
          if (!idToken) return;
          const data = await apiRequest('/auth/google', { method: 'POST', body: { idToken } });
          login({ user: data.user, token: data.token });
          window.location.href = '/posts';
        } catch (e) {
          console.error('Google login failed', e);
        }
    }

  return (
    <div className="w-full"> 
        <GoogleLoginButton
          onSuccess={credentialResponse => handleOnSuccess(credentialResponse)} 
          onError={() => {
            console.log('Login Failed');
          }}
          theme="outline"
          size="large"
          text="signin_with"
          shape="rectangular"
          width="100%"
        />
    </div>
    
  )
}

export default GoogleLogin;