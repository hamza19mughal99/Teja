import React from 'react';
import { Home, Search, Briefcase, User } from 'lucide-react';
import { Screen } from '../App';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

interface BottomNavigationProps {
  activeScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

export default function BottomNavigation({ activeScreen, onNavigate }: BottomNavigationProps) {
  const { user } = useSelector((state: RootState) => state.auth);
  const isAdmin = user?.role?.name?.toLowerCase() === 'admin' || user?.role?.type?.toLowerCase() === 'admin' || user?.role === 'admin';

  let navItems: any[] = [];

  if (isAdmin) {
    navItems = [
      { id: 'dashboard' as Screen, icon: Home, label: 'Home' },
      { id: 'users' as Screen, icon: User, label: 'Users' },
      { id: 'skills-approval' as Screen, icon: Briefcase, label: 'Approval' },
      { id: 'profile' as Screen, icon: User, label: 'Profile' },
    ];
  } else {
    navItems = [
      { id: 'dashboard' as Screen, icon: Home, label: 'Home' },
      { id: 'my-skills' as Screen, icon: Briefcase, label: 'Skills' },
      { id: 'discovery' as Screen, icon: Search, label: 'Search' },
      { id: 'profile' as Screen, icon: User, label: 'Profile' },
    ];
  }

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 pb-6 pt-2 safe-area-inset-bottom">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = activeScreen === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors hover:bg-gray-100"
            >
              <Icon
                className={`w-6 h-6 ${isActive ? 'text-[#2563eb]' : 'text-gray-400'}`}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className={`text-xs ${isActive ? 'text-[#2563eb]' : 'text-gray-500'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}