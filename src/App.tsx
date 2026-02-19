import React, { useState } from 'react';
import LoginScreen from './components/LoginScreen';
import DashboardScreen from './components/DashboardScreen';
import DiscoveryScreen from './components/DiscoveryScreen';
import SkillDetailScreen from './components/SkillDetailScreen';
import BookingRequestScreen from './components/BookingRequestScreen';
import RequestSuccessScreen from './components/RequestSuccessScreen';
import MySkillsScreen from './components/MySkillsScreen';
import ProfileScreen from './components/ProfileScreen';
import MessagesScreen from './components/MessagesScreen';
import NotificationsScreen from './components/NotificationsScreen';
import Sidebar from './components/Sidebar';

export type Screen = 'login' | 'dashboard' | 'discovery' | 'skill-detail' | 'booking' | 'success' | 'my-skills' | 'profile' | 'messages' | 'notifications';

export interface SkillData {
  id: string;
  title: string;
  category: string;
  provider: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  rating: number;
  reviewCount: number;
  creditHours: number;
  level: string;
  location: string;
  language: string;
  description: string;
  availability: string;
  image: string;
}

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [selectedSkill, setSelectedSkill] = useState<SkillData | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Update document title
  React.useEffect(() => {
    document.title = 'Teja - Exchange Skills, Build Community';
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentScreen('dashboard');
  };

  const handleNavigate = (screen: Screen, skill?: SkillData) => {
    if (skill) {
      setSelectedSkill(skill);
    }
    setCurrentScreen(screen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop/Tablet - Main Layout */}
      {isLoggedIn ? (
        <div className="flex h-screen">
          {/* Sidebar Navigation (Desktop) */}
          <Sidebar currentScreen={currentScreen} onNavigate={handleNavigate} />
          
          {/* Main Content Area */}
          <main className="flex-1 overflow-hidden">
            {currentScreen === 'dashboard' && (
              <DashboardScreen onNavigate={handleNavigate} />
            )}
            {currentScreen === 'discovery' && (
              <DiscoveryScreen onNavigate={handleNavigate} onSelectSkill={(skill) => handleNavigate('skill-detail', skill)} />
            )}
            {currentScreen === 'my-skills' && (
              <MySkillsScreen onNavigate={handleNavigate} />
            )}
            {currentScreen === 'profile' && (
              <ProfileScreen onNavigate={handleNavigate} />
            )}
            {currentScreen === 'messages' && (
              <MessagesScreen onNavigate={handleNavigate} />
            )}
            {currentScreen === 'notifications' && (
              <NotificationsScreen onNavigate={handleNavigate} />
            )}
            {currentScreen === 'skill-detail' && selectedSkill && (
              <SkillDetailScreen skill={selectedSkill} onNavigate={handleNavigate} />
            )}
            {currentScreen === 'booking' && selectedSkill && (
              <BookingRequestScreen skill={selectedSkill} onNavigate={handleNavigate} />
            )}
            {currentScreen === 'success' && selectedSkill && (
              <RequestSuccessScreen skill={selectedSkill} onNavigate={handleNavigate} />
            )}
          </main>
        </div>
      ) : (
        /* Login Screen - Centered */
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="w-full max-w-md">
            <LoginScreen onLogin={handleLogin} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;