import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      navigate(user.role === 'teacher' ? '/teacher' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-brand-900 flex items-center justify-center p-4">

      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-ocean-500/10 rounded-full blur-3xl" />
        {/* Extra subtle orb for depth */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-800/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md animate-slide-up">

        {/* ── Logo / Hero ── */}
        <div className="text-center mb-8">
          {/* Brain Box icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-brand-500 to-brand-700 rounded-3xl shadow-glow mb-5">
            <span className="text-4xl leading-none">🧠</span>
          </div>

          {/* App name */}
          <h1 className="text-4xl font-display font-bold text-white leading-tight">
            Brain<span className="text-brand-400">Box</span>
          </h1>

          {/* Tagline */}
          <p className="text-brand-300 font-semibold text-sm tracking-widest uppercase mt-1 mb-3">
            Engaging E-Learning System
          </p>

          {/* Welcome line */}
          <p className="text-gray-400 text-sm">
            Welcome back! Sign in to continue your journey.
          </p>
        </div>

        {/* ── Card ── */}
        <div className="bg-white/95 backdrop-blur rounded-3xl shadow-2xl p-8">

          {/* Error banner */}
          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm mb-6 border border-red-100 flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email" required
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                className="input-field"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password" required
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                className="input-field"
                placeholder="Your password"
              />
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full btn-primary py-3.5 text-base disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In to Brain Box'
              )}
            </button>
          </form>

          {/* Register link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Don't have an account?{' '}
              <Link to="/register" className="text-brand-600 font-semibold hover:text-brand-700">
                Register free
              </Link>
            </p>
          </div>

          {/* Demo credentials */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-xs text-center text-gray-400 mb-3 font-medium">
              🚀 Quick demo access — Brain Box
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setForm({ email: 'student@demo.com', password: 'demo1234' })}
                className="text-xs bg-gray-50 hover:bg-brand-50 text-gray-600 hover:text-brand-600 py-2 px-3 rounded-lg border border-gray-200 hover:border-brand-200 transition-all font-medium"
              >
                🎓 Student Demo
              </button>
              <button
                onClick={() => setForm({ email: 'teacher@demo.com', password: 'demo1234' })}
                className="text-xs bg-gray-50 hover:bg-ocean-50 text-gray-600 hover:text-ocean-600 py-2 px-3 rounded-lg border border-gray-200 hover:border-ocean-200 transition-all font-medium"
              >
                👨‍🏫 Teacher Demo
              </button>
            </div>
          </div>

          {/* Footer brand line */}
          <p className="text-center text-[10px] text-gray-300 mt-6 tracking-wide uppercase">
            Brain Box · Engaging E-Learning System
          </p>
        </div>
      </div>
    </div>
  );
}