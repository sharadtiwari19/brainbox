import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) return setError('Password must be at least 6 characters');
    setError('');
    setLoading(true);
    try {
      const user = await register(form.name, form.email, form.password, form.role);
      navigate(user.role === 'teacher' ? '/teacher' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-ocean-900 flex items-center justify-center p-4">

      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-ocean-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl" />
        {/* Centre depth orb */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-ocean-800/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md animate-slide-up">

        {/* ── Logo / Hero ── */}
        <div className="text-center mb-8">
          {/* Brain Box icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-ocean-500 to-ocean-700 rounded-3xl shadow-glow-blue mb-5">
            <span className="text-4xl leading-none">🧠</span>
          </div>

          {/* App name */}
          <h1 className="text-4xl font-display font-bold text-white leading-tight">
            Brain<span className="text-ocean-400">Box</span>
          </h1>

          {/* Tagline */}
          <p className="text-ocean-300 font-semibold text-sm tracking-widest uppercase mt-1 mb-3">
            Engaging E-Learning System
          </p>

          {/* Subtitle */}
          <p className="text-gray-400 text-sm">
            Create your free account and start learning today.
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
              <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
              <input
                type="text" required
                value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                className="input-field"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <input
                type="email" required
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                className="input-field"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <input
                type="password" required
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                className="input-field"
                placeholder="Min. 6 characters"
              />
            </div>

            {/* Role selector */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">I want to join Brain Box as a...</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'student', label: 'Student',  icon: '🎓',    desc: 'Learn & grow'     },
                  { value: 'teacher', label: 'Teacher',  icon: '👨‍🏫', desc: 'Teach & inspire'  },
                ].map(r => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setForm(p => ({ ...p, role: r.value }))}
                    className={`p-4 rounded-2xl border-2 text-left transition-all duration-200 ${
                      form.role === r.value
                        ? r.value === 'student'
                          ? 'border-brand-500 bg-brand-50'
                          : 'border-ocean-500 bg-ocean-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-2xl mb-1">{r.icon}</div>
                    <div className="font-semibold text-sm text-gray-800">{r.label}</div>
                    <div className="text-xs text-gray-500">{r.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-ocean py-3.5 text-base disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating your account...
                </>
              ) : (
                'Join Brain Box Free →'
              )}
            </button>
          </form>

          {/* Sign-in link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Already have a Brain Box account?{' '}
              <Link to="/login" className="text-ocean-600 font-semibold hover:text-ocean-700">
                Sign in
              </Link>
            </p>
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