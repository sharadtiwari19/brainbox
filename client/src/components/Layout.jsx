import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';

const StudentNav = [
  { path: '/dashboard', label: 'Dashboard', icon: '⊞' },
  { path: '/explore', label: 'Explore', icon: '🔍' },
  { path: '/leaderboard', label: 'Leaderboard', icon: '🏆' },
];

const TeacherNav = [
  { path: '/teacher', label: 'Dashboard', icon: '⊞' },
  { path: '/teacher/create-course', label: 'New Course', icon: '＋' },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const nav = user?.role === 'teacher' ? TeacherNav : StudentNav;

  const handleLogout = () => { logout(); navigate('/login'); };

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';
  const avatarColors = ['from-brand-400 to-brand-600', 'from-ocean-400 to-ocean-600', 'from-violet-400 to-violet-600', 'from-amber-400 to-amber-600'];
  const avatarColor = avatarColors[user?.name?.charCodeAt(0) % 4] || avatarColors[0];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-100 z-30 transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col shadow-lg lg:shadow-none`}>

        {/* ── Logo ── */}
        <div className="px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            {/* Icon: brain emoji inside brand-coloured pill */}
            <div className="w-9 h-9 bg-gradient-to-br from-brand-500 to-brand-700 rounded-xl flex items-center justify-center shadow-glow flex-shrink-0">
              <span className="text-lg leading-none">🧠</span>
            </div>
            <div className="leading-tight">
              <div className="font-display font-bold text-base text-gray-900">
                Brain<span className="text-brand-500">Box</span>
              </div>
              <div className="text-[10px] text-gray-400 font-medium tracking-wide leading-none mt-0.5">
                Engaging E-Learning System
              </div>
            </div>
          </div>

          {/* Role badge */}
          <div className="mt-3 flex items-center gap-2">
            <span className={`badge ${user?.role === 'teacher' ? 'bg-ocean-100 text-ocean-700' : 'bg-brand-50 text-brand-600'}`}>
              {user?.role === 'teacher' ? '👨‍🏫 Teacher' : '🎓 Student'}
            </span>
          </div>
        </div>

        {/* ── Navigation ── */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 mb-3">Menu</p>
          {nav.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/teacher'}
              className={({ isActive }) =>
                `sidebar-item ${isActive ? 'sidebar-item-active' : 'sidebar-item-inactive'}`
              }
              onClick={() => setSidebarOpen(false)}
            >
              <span className="text-lg leading-none">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* ── Points widget (students only) ── */}
        {user?.role === 'student' && (
          <div className="mx-4 mb-4 p-4 bg-gradient-to-br from-brand-50 to-orange-50 rounded-2xl border border-brand-100">
            <div className="text-xs text-brand-500 font-semibold uppercase tracking-wide mb-1">Your Points</div>
            <div className="text-2xl font-display font-bold text-brand-600">{user?.points?.toLocaleString() || 0}</div>
            <div className="text-xs text-gray-500 mt-1">Keep learning to earn more!</div>
          </div>
        )}

        {/* ── User profile ── */}
        <div className="px-4 py-4 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${avatarColor} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-gray-900 truncate">{user?.name}</p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main content area ── */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">

        {/* Top navbar */}
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Hamburger (mobile) */}
              <button
                className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              </button>

              {/* Page title + tagline */}
              <div>
                <h1 className="font-display font-bold text-lg text-gray-900 leading-tight">
                  {user?.role === 'teacher' ? 'Teacher Portal' : 'Brain Box'}
                </h1>
                <p className="text-xs text-gray-400 hidden sm:block leading-none mt-0.5">
                  {user?.role === 'teacher'
                    ? 'Brain Box: Engaging E-Learning System'
                    : new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>

            {/* Right side — points chip + avatar */}
            <div className="flex items-center gap-3">
              {user?.role === 'student' && (
                <div className="hidden sm:flex items-center gap-2 bg-amber-50 text-amber-600 px-3 py-1.5 rounded-xl border border-amber-200">
                  <span>⭐</span>
                  <span className="font-bold text-sm">{user?.points?.toLocaleString() || 0} pts</span>
                </div>
              )}
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${avatarColor} flex items-center justify-center text-white font-bold text-xs`}>
                {initials}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 px-4 lg:px-8 py-6 animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
}