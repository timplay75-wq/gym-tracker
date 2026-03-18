import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '@/i18n';

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
  <svg className={`w-6 h-6 stroke-current ${active ? 'stroke-[3]' : 'stroke-2'}`} fill="none" viewBox="0 0 24 24">
    <line x1="12" y1="5" x2="12" y2="19" strokeLinecap="round" />
    <line x1="5" y1="12" x2="19" y2="12" strokeLinecap="round" />
  </svg>
);

const ProfileIcon = ({ active }: { active: boolean }) => (
  <svg className={`w-6 h-6 ${active ? 'fill-current' : 'stroke-current stroke-2 fill-none'}`} viewBox="0 0 24 24">
    <circle cx="5" cy="12" r="1.5" />
    <circle cx="12" cy="12" r="1.5" />
    <circle cx="19" cy="12" r="1.5" />
  </svg>
);



const ShopIcon = ({ active }: { active: boolean }) => (
  <svg className={`w-6 h-6 ${active ? 'fill-current' : 'stroke-current stroke-2 fill-none'}`} viewBox="0 0 24 24">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 01-8 0" />
  </svg>
);

export const Navigation = () => {
  const location = useLocation();
  const { t } = useLanguage();

  const navItems = [
    { path: '/', label: t.nav.home, Icon: HomeIcon },
    { path: '/workouts', label: t.nav.workouts, Icon: WorkoutsIcon },
    { path: '/exercises', label: t.nav.create, Icon: AddIcon },
    { path: '/shop', label: t.shop.title, Icon: ShopIcon },
    { path: '/profile', label: t.nav.profile, Icon: ProfileIcon },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#16213e] border-t border-[#9333ea] shadow-lg z-50 safe-area-bottom">
      <div className="max-w-[480px] mx-auto">
        <div className="flex justify-around items-center h-16 px-1">
          {navItems.map(({ path, label, Icon }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={`flex flex-col items-center justify-center flex-1 h-full py-1 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'text-white bg-[#9333ea]'
                    : 'text-[#9333ea] active:bg-[#e9d5ff]'
                }`}
              >
                <Icon active={isActive} />
                <span className={`text-[10px] mt-1 font-medium leading-tight ${isActive ? 'font-semibold' : ''}`}>
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
