import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export function OAuthCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { handleOAuthCallback } = useAuth();
  // Код одноразовый: в StrictMode эффект выполняется дважды, и второй обмен
  // получил бы отказ уже после успешного входа.
  const exchanged = useRef(false);

  useEffect(() => {
    if (exchanged.current) return;
    exchanged.current = true;

    const code = params.get('code');
    const error = params.get('error');

    if (error || !code) {
      navigate(`/login${error ? `?error=${encodeURIComponent(error)}` : ''}`, { replace: true });
      return;
    }

    handleOAuthCallback(code)
      .then(() => navigate('/', { replace: true }))
      .catch(() => navigate('/login?error=oauth_failed', { replace: true }));
  }, [params, navigate, handleOAuthCallback]);

  return (
    <div className="min-h-screen bg-[#f5f5f5] dark:bg-[#1a1a2e] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#7c3aed] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
