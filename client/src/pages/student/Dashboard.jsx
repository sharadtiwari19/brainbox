import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import CourseCard from '../../components/CourseCard';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/auth/me'),
      api.get('/courses')
    ]).then(([meRes, coursesRes]) => {
      const enrolled = meRes.data.enrolledCourses || [];
      setCourses(enrolled);
      setAllCourses(coursesRes.data.slice(0, 4));
    }).finally(() => setLoading(false));
  }, []);

  const enrolledIds = new Set(courses.map(c => c._id));

  const statsCards = [
    { label: 'Courses Enrolled', value: courses.length,                        icon: '📚', light: 'bg-brand-50 text-brand-600'   },
    { label: 'Points Earned',    value: user?.points?.toLocaleString() || 0,   icon: '⭐', light: 'bg-amber-50 text-amber-600'   },
    { label: 'Modules Done',     value: user?.completedModules?.length || 0,   icon: '✅', light: 'bg-emerald-50 text-emerald-600'},
    { label: 'Quizzes Taken',    value: user?.quizResults?.length || 0,        icon: '📝', light: 'bg-ocean-50 text-ocean-600'   },
  ];

  /* ── Loading state ── */
  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="flex flex-col items-center gap-3">
        <div className="relative">
          <div className="w-12 h-12 bg-gradient-to-br from-brand-500 to-brand-700 rounded-xl flex items-center justify-center shadow-glow animate-pulse-soft">
            <span className="text-2xl leading-none">🧠</span>
          </div>
          <div className="absolute -inset-1.5 border-4 border-brand-300 border-t-transparent rounded-xl animate-spin" />
        </div>
        <p className="text-xs text-gray-400 tracking-widest uppercase">Loading Brain Box...</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-slide-up">

      {/* ── Welcome banner ── */}
      <div className="relative bg-gradient-to-r from-brand-600 via-brand-500 to-orange-400 rounded-3xl p-8 overflow-hidden">
        {/* Decorative background circles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -right-16 -top-16 w-64 h-64 bg-white/10 rounded-full" />
          <div className="absolute right-16 bottom-0  w-32 h-32 bg-white/5  rounded-full" />
          <div className="absolute left-1/2 top-0     w-48 h-48 bg-white/5  rounded-full blur-2xl" />
        </div>

        <div className="relative z-10">
          {/* Platform label */}
          <div className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm text-white/90 text-xs font-semibold px-3 py-1 rounded-full mb-3 border border-white/20">
            <span>🧠</span>
            <span>Brain Box: Engaging E-Learning System</span>
          </div>

          {/* Greeting */}
          <p className="text-brand-100 text-sm font-medium mb-1">Welcome back 👋</p>
          <h2 className="text-3xl font-display font-bold text-white mb-2">{user?.name}</h2>
          <p className="text-brand-100 text-sm max-w-sm">
            You have {courses.length} course{courses.length !== 1 ? 's' : ''} in progress. Keep it up!
          </p>

          <Link
            to="/explore"
            className="mt-4 inline-flex items-center gap-2 bg-white text-brand-600 font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-brand-50 transition-colors shadow-lg"
          >
            Explore Courses →
          </Link>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map(stat => (
          <div key={stat.label} className="card p-5">
            <div className={`w-10 h-10 rounded-xl ${stat.light} flex items-center justify-center text-xl mb-3`}>
              {stat.icon}
            </div>
            <div className="text-2xl font-display font-bold text-gray-900">{stat.value}</div>
            <div className="text-xs text-gray-500 mt-1 font-medium">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* ── My Courses ── */}
      {courses.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-display font-bold text-gray-900">My Courses</h2>
            <Link to="/explore" className="text-sm text-brand-600 font-semibold hover:text-brand-700">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {courses.map(course => (
              <CourseCard key={course._id} course={course} enrolled={true} />
            ))}
          </div>
        </section>
      )}

      {/* ── Recommended Courses ── */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-display font-bold text-gray-900">Recommended for You</h2>
          <Link to="/explore" className="text-sm text-brand-600 font-semibold hover:text-brand-700">
            Browse all →
          </Link>
        </div>

        {allCourses.filter(c => !enrolledIds.has(c._id)).length === 0 ? (
          <div className="card p-10 text-center">
            <div className="text-5xl mb-4">🎉</div>
            <p className="font-semibold text-gray-700">You're enrolled in all available Brain Box courses!</p>
            <p className="text-gray-400 text-sm mt-1">Check back later for new content.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {allCourses.filter(c => !enrolledIds.has(c._id)).slice(0, 4).map(course => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        )}
      </section>

      {/* ── Quick links ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          to="/leaderboard"
          className="card p-6 flex items-center gap-4 hover:shadow-card-hover transition-all duration-300 group"
        >
          <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
            🏆
          </div>
          <div>
            <h3 className="font-display font-bold text-gray-900">Leaderboard</h3>
            <p className="text-sm text-gray-500">See where you rank among Brain Box learners</p>
          </div>
          <span className="ml-auto text-gray-300 group-hover:text-brand-500 transition-colors">→</span>
        </Link>

        <Link
          to="/explore"
          className="card p-6 flex items-center gap-4 hover:shadow-card-hover transition-all duration-300 group"
        >
          <div className="w-12 h-12 bg-ocean-50 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
            🔍
          </div>
          <div>
            <h3 className="font-display font-bold text-gray-900">Explore Courses</h3>
            <p className="text-sm text-gray-500">Discover new topics on Brain Box</p>
          </div>
          <span className="ml-auto text-gray-300 group-hover:text-ocean-500 transition-colors">→</span>
        </Link>
      </div>

    </div>
  );
}