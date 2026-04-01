import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { apiUrl } from '../api';
import './GoogleLogin.css';

/**
 * Google Identity Services — sends ID token to Django for verification and JWT issuance.
 * Requires REACT_APP_GOOGLE_CLIENT_ID and matching GOOGLE_OAUTH_CLIENT_ID on the API.
 */
export default function GoogleLoginButton({ onError }) {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const clientId = (process.env.REACT_APP_GOOGLE_CLIENT_ID || '').trim();

  if (!clientId) {
    return (
      <button
        type="button"
        className="google-login-btn"
        disabled
        title="Set REACT_APP_GOOGLE_CLIENT_ID in .env (Google Cloud OAuth Web client ID)"
      >
        Sign in with Google (add client ID to .env)
      </button>
    );
  }

  const handleCredential = async (credentialResponse) => {
    const idToken = credentialResponse?.credential;
    if (!idToken) {
      onError?.('Google did not return a credential');
      return;
    }
    setBusy(true);
    try {
      const response = await fetch(apiUrl('auth/users/google/'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_token: idToken }),
      });
      const text = await response.text();
      let data = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        throw new Error('Invalid response from server');
      }
      if (!response.ok) {
        const base =
          (typeof data.error === 'string' && data.error) ||
          'Google sign-in failed';
        const extra = [data.detail, data.hint]
          .filter((x) => typeof x === 'string' && x.trim())
          .join(' ');
        const msg = extra ? `${base} ${extra}`.trim() : base;
        throw new Error(msg);
      }
      localStorage.setItem('token', data.access);
      localStorage.setItem('refresh', data.refresh);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('loggedIn', 'true');
      navigate('/');
    } catch (err) {
      onError?.(err.message || 'Google sign-in failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={`google-login-wrap ${busy ? 'google-login-busy' : ''}`}>
      <GoogleLogin
        onSuccess={handleCredential}
        onError={() => onError?.('Google popup closed or sign-in failed')}
        theme="outline"
        size="large"
        text="signin_with"
        shape="rectangular"
        width="384"
        useOneTap={false}
      />
    </div>
  );
}
