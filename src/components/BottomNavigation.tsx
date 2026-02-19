import React from 'react';
import { Home, Search, Briefcase, User, MessageSquare } from 'lucide-react';
import { Screen } from '../App';

interface BottomNavigationProps {
  activeScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

export default function BottomNavigation({ activeScreen, onNavigate }: BottomNavigationProps) {
  const navItems = [
    { id: 'dashboard' as Screen, icon: Home, label: 'Home' },
    { id: 'discovery' as Screen, icon: Search, label: 'Search' },
    { id: 'my-skills' as Screen, icon: Briefcase, label: 'Skills' },
    { id: 'messages' as Screen, icon: MessageSquare, label: 'Messages' },
    { id: 'profile' as Screen, icon: User, label: 'Profile' },
  ];

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