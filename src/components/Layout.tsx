import { Outlet, useLocation } from 'react-router-dom';

export const Layout = () => {
  const { key } = useLocation();

  return (
    <div className="min-h-screen bg-[#f5f5f5] dark:bg-[#1a1a2e]">
      <main key={key} className="min-h-screen animate-page-in">
        <Outlet />
      </main>
    </div>
  );
};
