import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import logo from 'figma:asset/8af2fca4d3cdaf52b9aca58ebe326adf7f046152.png';
import { useDispatch, useSelector } from 'react-redux';
import { forgotPasswordUser, clearError, clearSuccessMessage } from '../store/slices/AuthSlice';
import { AppDispatch, RootState } from '../store';

interface ForgotPasswordScreenProps {
    onNavigate: (screen: 'login' | 'reset-password') => void;
}

export default function ForgotPasswordScreen({ onNavigate }: ForgotPasswordScreenProps) {
    const [email, setEmail] = useState('');

    const dispatch = useDispatch<AppDispatch>();
    const { loading, error, successMessage } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        dispatch(clearError());
        dispatch(clearSuccessMessage());
    }, [dispatch]);

    const handleForgot = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        await dispatch(forgotPasswordUser({ email }));
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-white p-6">
            <div className="relative w-full max-w-md">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center mb-6">
                        <img src={logo} alt="Teja Logo" className="h-20 w-auto" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Reset Password</h1>
                    <p className="text-gray-600">Enter your email to receive recovery instructions</p>
                </div>

                <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-8 lg:p-10">
                    <form onSubmit={handleForgot} className="space-y-6">
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

                        {error && (
                            <div className="text-sm text-red-600 font-medium p-2 bg-red-50 rounded-lg border border-red-100">
                                {typeof error === 'string' ? error : 'Failed to send reset email. Please try again.'}
                            </div>
                        )}

                        {successMessage && (
                            <div className="text-sm text-green-700 font-medium p-3 bg-green-50 rounded-lg border border-green-200 flex flex-col gap-2">
                                <span>{successMessage}</span>
                                <button
                                    type="button"
                                    onClick={() => onNavigate('reset-password')}
                                    className="text-sm font-bold text-green-800 hover:text-green-900 underline self-start"
                                >
                                    Enter reset code
                                </button>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading || !!successMessage}
                            className={`w-full h-14 bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] hover:from-[#1d4ed8] hover:to-[#1e40af] text-white rounded-xl font-semibold text-base shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all flex items-center justify-center gap-2 group ${(loading || !!successMessage) ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Sending link...' : 'Send Reset Link'}
                            {!loading && !successMessage && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                        </button>
                    </form>

                    <div className="mt-8 text-center flex flex-col gap-4">
                        {/* <button
                            onClick={() => onNavigate('reset-password')}
                            className="text-sm text-blue-600 hover:text-blue-800 transition-colors font-semibold"
                        >
                            Already have a code? Reset password
                        </button> */}

                        <button
                            onClick={() => onNavigate('login')}
                            disabled={loading}
                            className="flex items-center justify-center gap-2 w-full text-gray-600 hover:text-gray-900 transition-colors font-semibold mt-2"
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
