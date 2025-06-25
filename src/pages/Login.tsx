import {  useState } from 'react';
import { supabase } from '../lib/supabase';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password }); // 📧+🔑 :contentReference[oaicite:0]{index=0}
    if (error) setError(error.message);

    setLoading(false);
    navigate('/');
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-honey">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-6 bg-polarWhite rounded-2xl shadow-lg p-8"
      >
        <h1 className="text-2xl font-bold text-center text-bearBrown">🐻 Log in</h1>

        <label className="block">
          <span className="block mb-1 text-sm font-medium">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2
                       focus:ring-bearBrown"
          />
        </label>

        <label className="block">
          <span className="block mb-1 text-sm font-medium">Password</span>
          <input
            type="password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2
                       focus:ring-bearBrown"
          />
        </label>

        {error && (
          <p className="text-center text-sm text-red-600">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 rounded-lg bg-bearBrown
                     hover:bg-pandaBlack transition text-polarWhite py-2 font-semibold"
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>

        <p className="text-center text-sm opacity-70">
          Don’t have an account?{' '}
          <a  className="underline">
            Sign up
          </a>
        </p>
      </form>
    </div>
  );
}
