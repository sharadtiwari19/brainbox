import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = () => {
    api.get('/courses/teacher').then(res => setCourses(res.data)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchCourses(); }, []);

  const handlePublish = async (id) => {
    try {
      const { data } = await api.post(`/courses/${id}/publish`);
      setCourses(prev => prev.map(c => c._id === id ? { ...c, isPublished: data.isPublished } : c));
    } catch { alert('Failed to update'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this course? This cannot be undone.')) return;
    try {
      await api.delete(`/courses/${id}`);
      setCourses(prev => prev.filter(c => c._id !== id));
    } catch { alert('Delete failed'); }
  };

  const totalStudents  = courses.reduce((sum, c) => sum + (c.enrolledStudents?.length || 0), 0);
  const publishedCount = courses.filter(c => c.isPublished).length;
  const totalModules   = courses.reduce((sum, c) => sum + (c.modules?.length || 0), 0);

  return (
    <div className="space-y-8 animate-slide-up">

      {/* ── Welcome banner ── */}
      <div className="bg-gradient-to-r from-ocean-600 to-ocean-400 rounded-3xl p-8 relative overflow-hidden">
        {/* Decorative background circles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -right-16 -top-16 w-64 h-64 bg-white/10 rounded-full" />
          <div className="absolute right-24 bottom-0  w-32 h-32 bg-white/5  rounded-full" />
          <div className="absolute left-1/2 top-0     w-48 h-48 bg-white/5  rounded-full blur-2xl" />
        </div>

        <div className="relative z-10">
          {/* Platform label */}
          <div className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm text-white/90 text-xs font-semibold px-3 py-1 rounded-full mb-3 border border-white/20">
            <span>🧠</span>
            <span>Brain Box: Engaging E-Learning System</span>
          </div>

          <p className="text-ocean-100 text-sm font-medium mb-1">Teacher Portal 👨‍🏫</p>
          <h2 className="text-3xl font-display font-bold text-white mb-2">{user?.name}</h2>
          <p className="text-ocean-100 text-sm">
            Manage your Brain Box courses and track student progress.
          </p>

          <Link
            to="/teacher/create-course"
            className="mt-4 inline-flex items-center gap-2 bg-white text-ocean-600 font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-ocean-50 transition-colors shadow-lg"
          >
            + Create New Course
          </Link>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Courses',  value: courses.length,  icon: '📚', color: 'bg-ocean-50 text-ocean-600'    },
          { label: 'Published',      value: publishedCount,  icon: '✅', color: 'bg-emerald-50 text-emerald-600' },
          { label: 'Total Students', value: totalStudents,   icon: '🎓', color: 'bg-brand-50 text-brand-600'    },
          { label: 'Total Modules',  value: totalModules,    icon: '🎥', color: 'bg-amber-50 text-amber-600'    },
        ].map(stat => (
          <div key={stat.label} className="card p-5">
            <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center text-xl mb-3`}>
              {stat.icon}
            </div>
            <div className="text-2xl font-display font-bold text-gray-900">{stat.value}</div>
            <div className="text-xs text-gray-500 mt-1 font-medium">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* ── Courses list ── */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-display font-bold text-gray-900">My Brain Box Courses</h2>
          <Link to="/teacher/create-course" className="btn-ocean text-sm px-4 py-2">+ New Course</Link>
        </div>

        {/* Loading state */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-ocean-500 to-ocean-700 rounded-xl flex items-center justify-center shadow-glow-blue animate-pulse-soft">
                  <span className="text-2xl leading-none">🧠</span>
                </div>
                <div className="absolute -inset-1.5 border-4 border-ocean-300 border-t-transparent rounded-xl animate-spin" />
              </div>
              <p className="text-xs text-gray-400 tracking-widest uppercase">Loading Brain Box...</p>
            </div>
          </div>

        /* Empty state */
        ) : courses.length === 0 ? (
          <div className="card p-16 text-center">
            <div className="text-5xl mb-4">📝</div>
            <h3 className="font-display font-bold text-gray-900 text-lg mb-2">No courses yet</h3>
            <p className="text-gray-500 mb-2">
              Create your first Brain Box course to start teaching.
            </p>
            <p className="text-xs text-gray-400 mb-6">
              Brain Box: Engaging E-Learning System
            </p>
            <Link to="/teacher/create-course" className="btn-ocean">
              Create First Course
            </Link>
          </div>

        /* Course cards */
        ) : (
          <div className="space-y-4">
            {courses.map(course => (
              <div key={course._id} className="card p-5 hover:shadow-card-hover transition-all duration-300">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">

                  {/* Course info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-display font-bold text-gray-900 truncate">{course.title}</h3>
                      <span className={`badge flex-shrink-0 ${course.isPublished ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                        {course.isPublished ? '● Published' : '○ Draft'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-1">{course.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-400 flex-wrap">
                      <span>📹 {course.modules?.length || 0} modules</span>
                      <span>🎓 {course.enrolledStudents?.length || 0} Brain Box students</span>
                      <span className="badge bg-gray-100 text-gray-500">{course.category}</span>
                      <span className="badge bg-gray-100 text-gray-500">{course.level}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => handlePublish(course._id)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                        course.isPublished
                          ? 'bg-gray-50 text-gray-600 border-gray-200 hover:border-red-200 hover:text-red-500'
                          : 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100'
                      }`}
                    >
                      {course.isPublished ? 'Unpublish' : 'Publish'}
                    </button>
                    <Link
                      to={`/teacher/course/${course._id}`}
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-ocean-200 bg-ocean-50 text-ocean-600 hover:bg-ocean-100 transition-all"
                    >
                      Manage
                    </Link>
                    <button
                      onClick={() => handleDelete(course._id)}
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-red-100 bg-red-50 text-red-500 hover:bg-red-100 transition-all"
                    >
                      Delete
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}