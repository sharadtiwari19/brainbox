import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/student/Dashboard';
import CoursePage from './pages/student/CoursePage';
import QuizPage from './pages/student/QuizPage';
import Leaderboard from './pages/student/Leaderboard';
import TeacherDashboard from './pages/teacher/Dashboard';
import CreateCourse from './pages/teacher/CreateCourse';
import ManageCourse from './pages/teacher/ManageCourse';
import Explore from './pages/student/Explore';

function PrivateRoute({ children, role }) {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-3">

        {/* Animated Brain Box logo */}
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-br from-brand-500 to-brand-700 rounded-2xl flex items-center justify-center shadow-glow animate-pulse-soft">
            <span className="text-3xl leading-none">🧠</span>
          </div>
          {/* Spinning ring around icon */}
          <div className="absolute -inset-1.5 border-4 border-brand-300 border-t-transparent rounded-2xl animate-spin" />
        </div>

        {/* App name */}
        <div className="text-center mt-2">
          <p className="font-display font-bold text-xl text-gray-800">
            Brain<span className="text-brand-500">Box</span>
          </p>
          <p className="text-xs text-gray-400 tracking-widest uppercase mt-0.5">
            Engaging E-Learning System
          </p>
        </div>

      </div>
    </div>
  );

  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return children;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to={user.role === 'teacher' ? '/teacher' : '/dashboard'} replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login"    element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

          <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard"  element={<StudentDashboard />} />
            <Route path="explore"    element={<Explore />} />
            <Route path="course/:id" element={<CoursePage />} />
            <Route path="quiz/:id"   element={<QuizPage />} />
            <Route path="leaderboard" element={<Leaderboard />} />

            <Route path="teacher"
              element={<PrivateRoute role="teacher"><TeacherDashboard /></PrivateRoute>} />
            <Route path="teacher/create-course"
              element={<PrivateRoute role="teacher"><CreateCourse /></PrivateRoute>} />
            <Route path="teacher/course/:id"
              element={<PrivateRoute role="teacher"><ManageCourse /></PrivateRoute>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}