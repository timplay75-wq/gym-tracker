import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export function OAuthCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { handleOAuthCallback } = useAuth();

  useEffect(() => {
    const token = params.get('token');
    const name = params.get('name');
    const email = params.get('email');
    const id = params.get('id');
    const avatar = params.get('avatar');

    if (token && id && email) {
      handleOAuthCallback({
        token,
        _id: id,
        name: name || 'User',
        email,
        avatar: avatar || undefined,
      });
      navigate('/', { replace: true });
    } else {
      navigate('/login', { replace: true });
    }
  }, [params, navigate, handleOAuthCallback]);

  return (
    <div className="min-h-screen bg-[#f5f5f5] dark:bg-[#1a1a2e] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#7c3aed] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
