import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Workouts } from './pages/Workouts';
import { AddWorkout } from './pages/AddWorkout';
import { Profile } from './pages/Profile';
import DesignDemo from './pages/DesignDemo';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="workouts" element={<Workouts />} />
          <Route path="add" element={<AddWorkout />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        <Route path="/design" element={<DesignDemo />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
