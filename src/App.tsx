import React, { useState } from 'react';
import LoginScreen from './components/LoginScreen';
import RegisterScreen from './components/RegisterScreen';
import ForgotPasswordScreen from './components/ForgotPasswordScreen';
import ResetPasswordScreen from './components/ResetPasswordScreen';
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
import StaticPageScreen from './components/StaticPageScreen';
import UsersScreen from './components/UsersScreen';
import CategoryScreen from './components/CategoryScreen';
import SkillsApprovalScreen from './components/SkillsApprovalScreen';
import ReportedUsersScreen from './components/ReportedUsersScreen';
import BookingsScreen from './components/BookingsScreen';
import { Toaster } from './components/ui/sonner';
import { Provider } from "react-redux";
import { store } from './store';
import axios from "axios";

export type Screen = 'login' | 'register' | 'forgot-password' | 'reset-password' | 'dashboard' | 'discovery' | 'skill-detail' | 'booking' | 'success' | 'my-skills' | 'profile' | 'messages' | 'notifications' | 'privacy' | 'terms' | 'about' | 'users' | 'category' | 'skills-approval' | 'reported-users' | 'bookings';

export interface SkillData {
  id: string;
  title: string;
  category: any;
  provider: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  user?: {
    id: number;
    username: string;
  };
  rating: number;
  reviewCount: number;
  creditHours: number;
  level: string;
  location: string;
  language: string;
  description: string;
  availability: string;
  availability_slots?: Array<{
    date: string;
    start_time: string;
    end_time: string;
  }>;
  image: string;
}

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>(
    localStorage.getItem('teja-token') ? 'dashboard' : 'login'
  );
  const [selectedSkill, setSelectedSkill] = useState<SkillData | null>(null);
  const [navData, setNavData] = useState<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('teja-token'));

  const queryParams = new URLSearchParams(window.location.search);
  const token = queryParams.get('code');
  console.log(token);

  // Get user details
  const userDetailsStr = localStorage.getItem('teja-details');
  const user = userDetailsStr ? JSON.parse(userDetailsStr) : null;

  axios.defaults.baseURL = 'https://loved-talent-fb87ca2a9f.strapiapp.com/api';

  // Update document title
  React.useEffect(() => {
    document.title = 'Teja - Exchange Skills, Build Community';
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentScreen('dashboard');
  };

  const handleNavigate = (screen: Screen, data?: any) => {
    if (data && (screen === 'skill-detail' || screen === 'booking' || screen === 'success')) {
      setSelectedSkill(data);
    } else {
      setNavData(data);
    }
    setCurrentScreen(screen);
  };

  return (
    <Provider store={store}>
      <div className="min-h-screen bg-gray-50">
        {/* Desktop/Tablet - Main Layout */}
        {isLoggedIn ? (
          <div className="flex h-screen">
            {/* Sidebar Navigation (Desktop) */}
            <Sidebar currentScreen={currentScreen} onNavigate={handleNavigate} user={user} />

            {/* Main Content Area */}
            <main className="flex-1 overflow-hidden">
              {currentScreen === 'dashboard' && (
                <DashboardScreen onNavigate={handleNavigate} user={user} />
              )}
              {currentScreen === 'my-skills' && (
                <MySkillsScreen onNavigate={handleNavigate} initialData={navData} />
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
              {currentScreen === 'users' && (
                <UsersScreen onNavigate={handleNavigate} />
              )}
              {currentScreen === 'discovery' && (
                <DiscoveryScreen onNavigate={handleNavigate} onSelectSkill={(skill) => handleNavigate('skill-detail', skill)} />
              )}
              {currentScreen === 'category' && (
                <CategoryScreen onNavigate={handleNavigate} />
              )}
              {currentScreen === 'skills-approval' && (
                <SkillsApprovalScreen onNavigate={handleNavigate} />
              )}
              {currentScreen === 'reported-users' && (
                <ReportedUsersScreen onNavigate={handleNavigate} />
              )}
              {currentScreen === 'bookings' && (
                <BookingsScreen onNavigate={handleNavigate} />
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
          /* Auth Screens & Static Pages */
          <>
            {['privacy', 'about', 'terms'].includes(currentScreen) ? (
              <>
                {currentScreen === 'privacy' && (
                  <StaticPageScreen pageType="privacy" onNavigate={(s) => handleNavigate(s as Screen)} />
                )}
                {currentScreen === 'about' && (
                  <StaticPageScreen pageType="about" onNavigate={(s) => handleNavigate(s as Screen)} />
                )}
                {currentScreen === 'terms' && (
                  <StaticPageScreen pageType="terms" onNavigate={(s) => handleNavigate(s as Screen)} />
                )}
              </>
            ) : (
              <div className="flex items-center justify-center min-h-screen p-4">
                <div className="w-full max-w-md">
                  {!token && currentScreen === 'login' && (
                    <LoginScreen onLogin={handleLogin} onNavigate={(s) => handleNavigate(s)} />
                  )}
                  {!token && currentScreen === 'register' && (
                    <RegisterScreen onRegister={handleLogin} onNavigate={(s) => handleNavigate(s)} />
                  )}
                  {!token && currentScreen === 'forgot-password' && (
                    <ForgotPasswordScreen onNavigate={(s) => handleNavigate(s)} />
                  )}
                  {(token || currentScreen === 'reset-password') && (
                    <ResetPasswordScreen onLogin={handleLogin} onNavigate={(s) => handleNavigate(s)} />
                  )}
                </div>
              </div>
            )}
          </>
        )}
        <Toaster position="top-right" richColors />
      </div>
    </Provider>
  );
}

export default App;