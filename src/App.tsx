import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Workouts } from './pages/Workouts';
import { AddWorkout } from './pages/AddWorkout';
import { WorkoutBuilder } from './pages/WorkoutBuilder';
import { ActiveWorkout } from './pages/ActiveWorkout';
import { Profile } from './pages/Profile';
import { ExerciseLibrary } from './pages/ExerciseLibrary';
import { CategoryView } from './pages/CategoryView';
import { CreateExercise } from './pages/CreateExercise';
import { SetupExercise } from './pages/SetupExercise';
import { CreateProgram } from './pages/CreateProgram';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import DesignDemo from './pages/DesignDemo';

// Защищённый роут — редирект на /login если не авторизован
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#7C4DFF] border-t-transparent rounded-full animate-spin" />
    </div>
  );
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function AppRoutes() {
  const { isAuthenticated, isLoading } = useAuth();

  // Не рендерим пока не определились с авторизацией
  if (isLoading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#7C4DFF] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <Routes>
      {/* Публичные */}
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/register" element={isAuthenticated ? <Navigate to="/" replace /> : <Register />} />
      <Route path="/design" element={<DesignDemo />} />

      {/* Защищённые */}
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Home />} />
        <Route path="workouts" element={<Workouts />} />
        <Route path="add" element={<AddWorkout />} />
        <Route path="builder" element={<WorkoutBuilder />} />
        <Route path="exercises" element={<ExerciseLibrary />} />
        <Route path="category/:categoryId" element={<CategoryView />} />
        <Route path="create-exercise" element={<CreateExercise />} />
        <Route path="setup-exercise" element={<SetupExercise />} />
        <Route path="create-program" element={<CreateProgram />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      <Route path="/active-workout" element={<ProtectedRoute><ActiveWorkout /></ProtectedRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

