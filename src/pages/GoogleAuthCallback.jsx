import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function GoogleAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    // Get token and user data from URL parameters
    const token = searchParams.get('token');
    const userParam = searchParams.get('user');

    if (token && userParam) {
      try {
        // Parse user data
        const user = JSON.parse(decodeURIComponent(userParam));
        
        // Save to localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('loggedIn', 'true');
        
        // Show success message
        setTimeout(() => {
          navigate('/');
        }, 1000);
      } catch (err) {
        console.error('Error parsing user data:', err);
        setError('Failed to process authentication response');
        setTimeout(() => navigate('/login'), 2000);
      }
    } else {
      setError('Authentication failed. Please try again.');
      setTimeout(() => navigate('/login'), 2000);
    }
  }, [searchParams, navigate]);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      flexDirection: 'column',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        fontSize: '24px',
        marginBottom: '20px',
        color: error ? '#dc3545' : '#28a745'
      }}>
        {error ? '❌' : '✅'}
      </div>
      <div style={{ fontSize: '18px', color: '#333' }}>
        {error || 'Signing you in...'}
      </div>
      {!error && (
        <div style={{
          marginTop: '20px',
          width: '40px',
          height: '40px',
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #3498db',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
      )}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
