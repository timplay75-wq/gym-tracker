import { Outlet } from 'react-router-dom';
import { Navigation } from './Navigation';

export const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 pb-16">
      <header className="bg-gray-800 dark:bg-gray-950 text-white p-4 shadow-md">
        <h1 className="text-2xl font-bold">Gym Tracker</h1>
      </header>
      <main className="container mx-auto p-4">
        <Outlet />
      </main>
      <Navigation />
    </div>
  );
};
