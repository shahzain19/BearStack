import { useState, type FormEvent } from 'react';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setError(error.message);
    } else {
      const user = data.user;
      if (user) {
        // Optional: update profile manually (e.g. for setting custom fields)
        await supabase
          .from('profiles')
          .update({ email }) // Add other fields if needed (e.g. name)
          .eq('id', user.id);
      }

      setDone(true); // Show confirmation screen
    }

    setLoading(false);
  }

  if (done) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-honey">
        <div className="max-w-sm bg-polarWhite rounded-2xl shadow-lg p-8 text-center">
          <h1 className="text-2xl font-bold text-bearBrown mb-4">🎉 Almost there!</h1>
          <p className="mb-6">
            We sent a confirmation link to <strong>{email}</strong>.
            Click it to activate your account, then you can log in.
          </p>
          <a
            href="/login"
            className="inline-block px-4 py-2 rounded-lg bg-bearBrown hover:bg-pandaBlack
                       text-polarWhite font-semibold transition"
          >
            Back to Log In
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-honey">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-6 bg-polarWhite rounded-2xl shadow-lg p-8"
      >
        <h1 className="text-2xl font-bold text-center text-bearBrown">📚 Sign up</h1>

        <label className="block">
          <span className="block mb-1 text-sm font-medium">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-bearBrown"
          />
        </label>

        <label className="block">
          <span className="block mb-1 text-sm font-medium">Password</span>
          <input
            type="password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-bearBrown"
          />
        </label>

        {error && <p className="text-center text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 rounded-lg bg-bearBrown
                     hover:bg-pandaBlack transition text-polarWhite py-2 font-semibold"
        >
          {loading ? 'Creating…' : 'Create account'}
        </button>

        <p className="text-center text-sm opacity-70">
          Already have an account?{' '}
          <Link to="/login" className="underline">Log in</Link>
        </p>
      </form>
    </div>
  );
}
