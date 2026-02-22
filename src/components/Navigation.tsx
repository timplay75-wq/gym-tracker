import { Link, useLocation } from 'react-router-dom';

const HomeIcon = ({ active }: { active: boolean }) => (
  <svg className={`w-6 h-6 ${active ? 'fill-current' : 'stroke-current stroke-2 fill-none'}`} viewBox="0 0 24 24">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const WorkoutsIcon = ({ active }: { active: boolean }) => (
  <svg className={`w-6 h-6 ${active ? 'fill-current' : 'stroke-current stroke-2 fill-none'}`} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);

const SearchIcon = ({ active }: { active: boolean }) => (
  <svg className={`w-6 h-6 ${active ? 'fill-current' : 'stroke-current stroke-2 fill-none'}`} viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const ProfileIcon = ({ active }: { active: boolean }) => (
  <svg className={`w-6 h-6 ${active ? 'fill-current' : 'stroke-current stroke-2 fill-none'}`} viewBox="0 0 24 24">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

export const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Главная', Icon: HomeIcon },
    { path: '/workouts', label: 'Тренировки', Icon: WorkoutsIcon },
    { path: '/exercises', label: 'Создать', Icon: SearchIcon },
    { path: '/profile', label: 'Профиль', Icon: ProfileIcon },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#9333ea] shadow-lg z-50 safe-area-bottom">
      <div className="max-w-[480px] mx-auto">
        <div className="flex justify-around items-center h-20 px-2">
          {navItems.map(({ path, label, Icon }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={`flex flex-col items-center justify-center flex-1 h-full py-2 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'text-white bg-[#9333ea]'
                    : 'text-[#9333ea] active:bg-[#e9d5ff]'
                }`}
              >
                <Icon active={isActive} />
                <span className={`text-xs mt-1.5 font-medium ${isActive ? 'font-semibold' : ''}`}>
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
