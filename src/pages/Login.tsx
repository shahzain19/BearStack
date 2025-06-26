import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session }
      } = await supabase.auth.getSession();
      if (session) navigate('/');
    };
    checkSession();
  }, [navigate]);

  async function handleGoogleLogin() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin // Redirects back to your site after login
      }
    });
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-honey">
      <div className="w-full max-w-sm space-y-6 bg-polarWhite rounded-2xl shadow-lg p-8 text-center">
        <h1 className="text-2xl font-bold text-bearBrown">📚 Welcome to BearStacks</h1>
        <p className="text-sm text-gray-600">A cozy place to read and write books</p>

        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 py-2 rounded-lg bg-bearBrown
                     hover:bg-pandaBlack transition text-polarWhite font-semibold"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-5 h-5"
          />
          Continue with Google
        </button>
      </div>
    </div>
  );
}
