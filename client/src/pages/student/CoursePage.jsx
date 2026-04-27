import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

function getYouTubeId(url) {
  if (!url) return null;
  const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

function VideoPlayer({ url }) {
  const videoId = getYouTubeId(url);
  if (!videoId && url) {
    return (
      <div className="video-responsive bg-gray-900 rounded-2xl flex items-center justify-center">
        <video src={url} controls className="absolute inset-0 w-full h-full rounded-2xl" />
      </div>
    );
  }
  if (!videoId) return (
    <div className="video-responsive bg-gray-900 rounded-2xl">
      <div className="absolute inset-0 flex items-center justify-center text-white text-center p-8">
        <div>
          <div className="text-5xl mb-4">📹</div>
          <p className="font-semibold">No video available</p>
        </div>
      </div>
    </div>
  );
  return (
    <div className="video-responsive">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
        title="Course Video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}

export default function CoursePage() {
  const { id } = useParams();
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [activeModule, setActiveModule] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchCourse = async () => {
    try {
      const { data } = await api.get(`/courses/${id}`);
      setCourse(data);
      if (data.modules?.length > 0) {
        const firstUnlocked = data.modules.find(m => !m.locked) || data.modules[0];
        setActiveModule(firstUnlocked);
      }
    } catch { navigate('/explore'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCourse(); }, [id]);

  useEffect(() => {
    if (activeModule && course?.isEnrolled) {
      api.get(`/quiz/module/${activeModule._id}`)
        .then(res => setQuiz(res.data))
        .catch(() => setQuiz(null));
    }
  }, [activeModule]);

  const handleEnroll = async () => {
    setEnrolling(true);
    try {
      await api.post(`/courses/${id}/enroll`);
      await fetchCourse();
      await refreshUser();
    } catch (err) {
      alert(err.response?.data?.message || 'Enrollment failed');
    } finally { setEnrolling(false); }
  };

  const handleComplete = async () => {
    if (!activeModule || completing) return;
    setCompleting(true);
    try {
      await api.post(`/courses/modules/${activeModule._id}/complete`);
      await fetchCourse();
      await refreshUser();
    } finally { setCompleting(false); }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!course) return null;

  const completedCount = course.modules?.filter(m => m.completed).length || 0;
  const totalModules = course.modules?.length || 0;
  const progress = totalModules > 0 ? Math.round((completedCount / totalModules) * 100) : 0;

  return (
    <div className="animate-fade-in">
      {/* Course header */}
      <div className="mb-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="badge bg-brand-100 text-brand-700">{course.category}</span>
              <span className="badge bg-gray-100 text-gray-600">{course.level}</span>
            </div>
            <h1 className="text-2xl font-display font-bold text-gray-900">{course.title}</h1>
            <p className="text-gray-500 mt-1 text-sm">by {course.teacher?.name}</p>
          </div>
          {!course.isEnrolled && user?.role === 'student' && (
            <button onClick={handleEnroll} disabled={enrolling} className="btn-primary flex-shrink-0">
              {enrolling ? 'Enrolling...' : 'Enroll Free'}
            </button>
          )}
        </div>

        {course.isEnrolled && (
          <div className="mt-4 bg-gray-100 rounded-full h-2">
            <div className="progress-bar h-2" style={{ width: `${progress}%` }} />
          </div>
        )}
        {course.isEnrolled && (
          <p className="text-xs text-gray-500 mt-1">{progress}% complete · {completedCount}/{totalModules} modules</p>
        )}
      </div>

      <div className="flex gap-6 relative">
        {/* Mobile sidebar toggle */}
        <button
          className="lg:hidden fixed bottom-6 right-6 z-20 w-14 h-14 bg-brand-500 text-white rounded-2xl shadow-glow flex items-center justify-center text-xl"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >📋</button>

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/40 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Module sidebar */}
        <aside className={`
          fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-30 transform transition-transform duration-300 lg:relative lg:top-auto lg:right-auto lg:h-auto lg:w-80 lg:shadow-none lg:transform-none lg:z-auto
          ${sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
        `}>
          <div className="card h-full lg:h-auto overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-display font-bold text-gray-900 text-sm">Course Modules</h3>
              <button className="lg:hidden text-gray-400" onClick={() => setSidebarOpen(false)}>✕</button>
            </div>
            <div className="overflow-y-auto flex-1">
              {course.modules?.map((mod, idx) => (
                <button
                  key={mod._id}
                  onClick={() => {
                    if (!mod.locked) { setActiveModule(mod); setSidebarOpen(false); }
                  }}
                  disabled={mod.locked}
                  className={`w-full text-left px-4 py-4 border-b border-gray-50 transition-all duration-200 ${
                    activeModule?._id === mod._id ? 'bg-brand-50 border-l-4 border-l-brand-500' : ''
                  } ${mod.locked ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 cursor-pointer'}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-sm font-bold ${
                      mod.completed ? 'bg-emerald-100 text-emerald-600' :
                      mod.locked ? 'bg-gray-100 text-gray-400' :
                      activeModule?._id === mod._id ? 'bg-brand-500 text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {mod.completed ? '✓' : mod.locked ? '🔒' : idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-semibold leading-tight ${
                        activeModule?._id === mod._id ? 'text-brand-700' : 'text-gray-800'
                      } line-clamp-2`}>
                        {mod.title}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">{mod.duration}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0 space-y-5">
          {!course.isEnrolled ? (
            <div className="card p-10 text-center">
              <div className="text-5xl mb-4">🔒</div>
              <h3 className="font-display font-bold text-gray-900 text-xl mb-2">Enroll to Access Content</h3>
              <p className="text-gray-500 mb-6">Join this course to watch all video lessons and take quizzes</p>
              <button onClick={handleEnroll} disabled={enrolling} className="btn-primary text-base px-8 py-3">
                {enrolling ? 'Enrolling...' : 'Enroll for Free'}
              </button>
            </div>
          ) : activeModule ? (
            <>
              {/* Video */}
              <div className="card p-4">
                <VideoPlayer url={activeModule.videoUrl} />
                <div className="mt-4">
                  <h2 className="font-display font-bold text-lg text-gray-900">{activeModule.title}</h2>
                  {activeModule.description && (
                    <p className="text-gray-500 text-sm mt-2">{activeModule.description}</p>
                  )}
                  <div className="flex items-center gap-3 mt-4">
                    {!activeModule.completed && (
                      <button
                        onClick={handleComplete}
                        disabled={completing}
                        className="btn-primary text-sm px-5 py-2"
                      >
                        {completing ? 'Marking...' : '✓ Mark as Complete'}
                      </button>
                    )}
                    {activeModule.completed && (
                      <span className="badge bg-emerald-100 text-emerald-700 px-3 py-1.5 text-sm">✓ Completed</span>
                    )}
                    {quiz && (
                      <button
                        onClick={() => navigate(`/quiz/${quiz._id}`)}
                        className="btn-ocean text-sm px-5 py-2"
                      >
                        📝 Take Quiz
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Module description */}
              <div className="card p-6">
                <h3 className="font-display font-bold text-gray-900 mb-2">About This Lesson</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {activeModule.description || course.description}
                </p>
              </div>
            </>
          ) : (
            <div className="card p-10 text-center">
              <div className="text-5xl mb-4">📚</div>
              <p className="text-gray-500">Select a module from the sidebar to start learning</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
