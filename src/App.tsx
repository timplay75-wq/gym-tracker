import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './i18n';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './contexts/ToastContext';
import { ToastContainer } from './components/Toast';
import { OfflineBanner } from './components/OfflineBanner';
import { SyncManager } from './components/SyncManager';
import { Layout } from './components/Layout';

// Lazy-loaded pages
const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const Workouts = lazy(() => import('./pages/Workouts').then(m => ({ default: m.Workouts })));

const ActiveWorkout = lazy(() => import('./pages/ActiveWorkout').then(m => ({ default: m.ActiveWorkout })));
const Profile = lazy(() => import('./pages/Profile').then(m => ({ default: m.Profile })));
const ExerciseLibrary = lazy(() => import('./pages/ExerciseLibrary').then(m => ({ default: m.ExerciseLibrary })));
const CategoryView = lazy(() => import('./pages/CategoryView').then(m => ({ default: m.CategoryView })));
const CreateExercise = lazy(() => import('./pages/CreateExercise').then(m => ({ default: m.CreateExercise })));
const SetupExercise = lazy(() => import('./pages/SetupExercise').then(m => ({ default: m.SetupExercise })));
const CreateProgram = lazy(() => import('./pages/CreateProgram').then(m => ({ default: m.CreateProgram })));
const Programs = lazy(() => import('./pages/Programs').then(m => ({ default: m.Programs })));
const Statistics = lazy(() => import('./pages/Statistics').then(m => ({ default: m.Statistics })));
const ExerciseStats = lazy(() => import('./pages/ExerciseStats').then(m => ({ default: m.ExerciseStats })));

const Login = lazy(() => import('./pages/Login').then(m => ({ default: m.Login })));
const Register = lazy(() => import('./pages/Register').then(m => ({ default: m.Register })));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword').then(m => ({ default: m.ForgotPassword })));
const ResetPassword = lazy(() => import('./pages/ResetPassword').then(m => ({ default: m.ResetPassword })));
const OAuthCallback = lazy(() => import('./pages/OAuthCallback').then(m => ({ default: m.OAuthCallback })));
const NotificationsSettings = lazy(() => import('./pages/NotificationsSettings').then(m => ({ default: m.NotificationsSettings })));
const BodyMetrics = lazy(() => import('./pages/BodyMetrics').then(m => ({ default: m.BodyMetrics })));
const Shop = lazy(() => import('./pages/Shop').then(m => ({ default: m.Shop })));


// Spinner shown while lazy chunks load
function PageSpinner() {
  return (
    <div className="min-h-screen bg-[#f5f5f5] dark:bg-[#1a1a2e] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#7c3aed] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

// Защищённый роут — редирект на /login если не авторизован
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <PageSpinner />;
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function AppRoutes() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <PageSpinner />;

  return (
    <Suspense fallback={<PageSpinner />}>
      <Routes>
      {/* Публичные */}
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/register" element={isAuthenticated ? <Navigate to="/" replace /> : <Register />} />
      <Route path="/forgot-password" element={isAuthenticated ? <Navigate to="/" replace /> : <ForgotPassword />} />
      <Route path="/reset-password/:token" element={isAuthenticated ? <Navigate to="/" replace /> : <ResetPassword />} />
      <Route path="/oauth-callback" element={<OAuthCallback />} />

      {/* Защищённые */}
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Home />} />
        <Route path="workouts" element={<Workouts />} />

        <Route path="exercises" element={<ExerciseLibrary />} />
        <Route path="category/:categoryId" element={<CategoryView />} />
        <Route path="create-exercise" element={<CreateExercise />} />
        <Route path="setup-exercise" element={<SetupExercise />} />
        <Route path="create-program" element={<CreateProgram />} />
        <Route path="programs" element={<Programs />} />

        <Route path="stats" element={<Statistics />} />
        <Route path="stats/exercise/:name" element={<ExerciseStats />} />
        <Route path="profile" element={<Profile />} />
        <Route path="notifications-settings" element={<NotificationsSettings />} />
        <Route path="body-metrics" element={<BodyMetrics />} />
        <Route path="shop" element={<Shop />} />
      </Route>

      <Route path="/active-workout" element={<ProtectedRoute><ActiveWorkout /></ProtectedRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </Suspense>
  );
}

function App() {
  // Check workout reminder on app start
  useEffect(() => {
    try {
      const raw = localStorage.getItem('gym-notif-settings');
      if (!raw || !('Notification' in window) || Notification.permission !== 'granted') return;
      const s = JSON.parse(raw) as { enabled: boolean; reminderTime: string; days: number[] };
      if (!s.enabled) return;
      const now = new Date();
      if (!s.days.includes(now.getDay())) return;
      const [h, m] = s.reminderTime.split(':').map(Number);
      const target = new Date(); target.setHours(h, m, 0, 0);
      const diff = Math.abs(now.getTime() - target.getTime());
      const lastShown = localStorage.getItem('gym-notif-last-shown');
      const alreadyToday = lastShown && new Date(lastShown).toDateString() === now.toDateString();
      if (diff < 5 * 60 * 1000 && !alreadyToday) {
        new Notification('Gym Tracker 💪', {
          body: 'Время тренировки! Не забудь позаниматься сегодня.',
          icon: '/icons/icon-192x192.png',
        });
        localStorage.setItem('gym-notif-last-shown', now.toISOString());
      }
    } catch { /* ignore */ }
  }, []);

  return (
    <LanguageProvider>
      <ThemeProvider>
        <ToastProvider>
          <BrowserRouter>
            <AuthProvider>
              <OfflineBanner />
              <SyncManager />
              <AppRoutes />
              <ToastContainer />
            </AuthProvider>
          </BrowserRouter>
        </ToastProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}

export default App;

