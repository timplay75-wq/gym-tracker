import { Link, useLocation } from 'react-router-dom';

export const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Главная', icon: '🏠' },
    { path: '/workouts', label: 'Тренировки', icon: '💪' },
    { path: '/add', label: 'Добавить', icon: '➕' },
    { path: '/profile', label: 'Профиль', icon: '👤' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white shadow-lg">
      <div className="flex justify-around items-center h-16">
        {navItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
              location.pathname === item.path
                ? 'bg-primary-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <span className="text-2xl">{item.icon}</span>
            <span className="text-xs mt-1">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};
