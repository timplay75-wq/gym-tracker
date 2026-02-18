import { Outlet } from 'react-router-dom';
import { Navigation } from './Navigation';

export const Layout = () => {
  return (
    <div className="min-h-screen bg-white">
      <main className="min-h-screen">
        <Outlet />
      </main>
      <Navigation />
    </div>
  );
};
