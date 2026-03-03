import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import logo from 'figma:asset/8af2fca4d3cdaf52b9aca58ebe326adf7f046152.png';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../store/slices/AuthSlice';
import { AppDispatch, RootState } from '../store';

interface LoginScreenProps {
  onLogin: () => void;
  onNavigate: (screen: 'register' | 'forgot-password' | 'privacy' | 'terms' | 'about') => void;
}

export default function LoginScreen({ onLogin, onNavigate }: LoginScreenProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    // Call API using Redux Thunk
    const resultAction = await dispatch(loginUser({ identifier: email, password }));

    if (loginUser.fulfilled.match(resultAction)) {
      onLogin(); // Proceed inside App.tsx
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white p-6">
      <div className="relative w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center mb-6">
            <img src={logo} alt="Teja Logo" className="h-20 w-auto" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome to Teja</h1>
          <p className="text-gray-600">Exchange skills, build community, grow together</p>
        </div>

        <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-8 lg:p-10">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-semibold text-gray-700 block">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-14 px-4 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#2563eb] focus:ring-4 focus:ring-blue-500/10 transition-all"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-semibold text-gray-700 block">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-14 px-4 pr-12 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#2563eb] focus:ring-4 focus:ring-blue-500/10 transition-all"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-sm text-red-600 font-medium p-2 bg-red-50 rounded-lg border border-red-100">
                {typeof error === 'string' ? error : 'Login failed. Please check your credentials.'}
              </div>
            )}

            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={() => onNavigate('forgot-password')}
                className="text-sm font-semibold text-[#2563eb] hover:text-[#1d4ed8] transition-colors"
                disabled={loading}
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full h-14 bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] hover:from-[#1d4ed8] hover:to-[#1e40af] text-white rounded-xl font-semibold text-base shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all flex items-center justify-center gap-2 group ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Signing in...' : 'Sign in to your account'}
              {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <button
                onClick={() => onNavigate('register')}
                disabled={loading}
                className="font-semibold text-[#2563eb] hover:text-[#1d4ed8] transition-colors"
              >
                Create an account
              </button>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center space-y-3">
          <p className="text-sm text-gray-500 flex items-center justify-center flex-wrap gap-x-2">
            By signing in, you agree to our
            <button onClick={() => onNavigate('terms')} className="text-[#2563eb] hover:underline font-medium">Terms </button>
            {' & '}
            <button onClick={() => onNavigate('privacy')} className="text-[#2563eb] hover:underline font-medium"> Privacy Policy</button>
          </p>
          <p className="text-sm text-gray-500">
            Want to learn more? <button onClick={() => onNavigate('about')} className="text-[#2563eb] hover:underline font-medium">About Us</button>
          </p>
        </div>
      </div>
    </div>
  );
}