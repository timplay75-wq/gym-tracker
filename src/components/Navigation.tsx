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

const AddIcon = ({ active }: { active: boolean }) => (
  <svg className={`w-6 h-6 ${active ? 'fill-current' : 'stroke-current stroke-2 fill-none'}`} viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="16" />
    <line x1="8" y1="12" x2="16" y2="12" />
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
    { path: '/builder', label: 'Добавить', Icon: AddIcon },
    { path: '/profile', label: 'Профиль', Icon: ProfileIcon },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-sm z-50 safe-area-bottom">
      <div className="max-w-screen-xl mx-auto">
        <div className="flex justify-around items-center h-16">
          {navItems.map(({ path, label, Icon }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={`flex flex-col items-center justify-center flex-1 h-full transition-all duration-200 ${
                  isActive
                    ? 'text-primary-500'
                    : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                }`}
              >
                <Icon active={isActive} />
                <span className={`text-xs mt-1 font-medium ${isActive ? 'font-semibold' : ''}`}>
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
