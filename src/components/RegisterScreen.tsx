import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, ArrowRight, ArrowLeft } from 'lucide-react';
import logo from 'figma:asset/8af2fca4d3cdaf52b9aca58ebe326adf7f046152.png';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearError } from '../store/slices/AuthSlice';
import { AppDispatch, RootState } from '../store';

interface RegisterScreenProps {
    onRegister: () => void;
    onNavigate: (screen: 'login') => void;
}

export default function RegisterScreen({ onRegister, onNavigate }: RegisterScreenProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const dispatch = useDispatch<AppDispatch>();
    const { loading, error } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        dispatch(clearError());
    }, [dispatch]);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!username || !email || !password) return;

        const resultAction = await dispatch(registerUser({ username, email, password }));

        if (registerUser.fulfilled.match(resultAction)) {
            onNavigate('login'); // Successfully registered, go to login
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-white p-6">
            <div className="relative w-full max-w-md">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center mb-6">
                        <img src={logo} alt="Teja Logo" className="h-20 w-auto" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Create an Account</h1>
                    <p className="text-gray-600">Join the Teja community today</p>
                </div>

                <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-8 lg:p-10">
                    <form onSubmit={handleRegister} className="space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="username" className="text-sm font-semibold text-gray-700 block">
                                Username
                            </label>
                            <input
                                id="username"
                                type="text"
                                placeholder="Choose a username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full h-14 px-4 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#2563eb] focus:ring-4 focus:ring-blue-500/10 transition-all"
                                required
                            />
                        </div>

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
                                    placeholder="Create a strong password"
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
                                {typeof error === 'string' ? error : 'Registration failed. Please try again.'}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full h-14 bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] hover:from-[#1d4ed8] hover:to-[#1e40af] text-white rounded-xl font-semibold text-base shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all flex items-center justify-center gap-2 group ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Creating account...' : 'Create Account'}
                            {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <button
                            onClick={() => onNavigate('login')}
                            disabled={loading}
                            className="flex items-center justify-center gap-2 w-full text-gray-600 hover:text-gray-900 transition-colors font-semibold"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to login
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
