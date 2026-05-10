import React, { useState, useEffect } from 'react';
import {
  Bell, Search, ArrowRight, Code, Plus, Loader2, Calendar, Clock,
  CheckCircle2, User, BookOpen, Send, Download, Users, Layers,
  ShieldAlert, Settings, BarChart3, ShieldCheck
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import BottomNavigation from './BottomNavigation';
import { Screen } from '../App';
import { apiService } from '../services/apiService';
import { toast } from 'sonner';

interface DashboardScreenProps {
  onNavigate: (screen: Screen, data?: any) => void;
  user?: any;
}

export default function DashboardScreen({ onNavigate, user: initialUser }: DashboardScreenProps) {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Check if initialUser or local storage user is admin
  const storedUser = JSON.parse(localStorage.getItem('teja-details') || '{}');
  const user = initialUser || storedUser;
  const isAdmin = user?.role?.name?.toLowerCase() === 'admin' || user?.role?.type?.toLowerCase() === 'admin' || user?.role === 'admin';

  const fetchDashboardData = async () => {
    if (isAdmin) {
      // Strictly avoid API call for Admin as requested
      setDashboardData({
        profile: user,
        stats: { totalBookings: 0, offeredSkills: 0, sentRequests: 0, receivedRequests: 0 },
        offeredSkills: [],
        bookings: { sentRequests: [], receivedRequests: [] }
      });
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await apiService.getUserDashboard();
      if (res?.data) {
        setDashboardData(res.data);
      }
    } catch (err: any) {
      console.error("Dashboard fetch error:", err);
      toast.error(typeof err === 'string' ? err : "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!dashboardData && !isAdmin) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 h-screen p-6 text-center">
        <p className="text-gray-500 mb-4">Unable to load dashboard data.</p>
        <Button onClick={fetchDashboardData}>Retry</Button>
      </div>
    );
  }

  const { stats, profile, offeredSkills, bookings } = dashboardData || {};
  const recentBookings = [
    ...(bookings?.sentRequests || []).map((b: any) => ({ ...b, type: 'sent' })),
    ...(bookings?.receivedRequests || []).map((b: any) => ({ ...b, type: 'received' }))
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

  return (
    <div className="h-full flex flex-col bg-gray-50 overflow-y-auto w-full">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 px-6 lg:px-8 py-4 top-0 z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={isAdmin ? "Search management console..." : "Search your skills..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-12 pr-4 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-blue-500/10 transition-all"
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('notifications')}
              className="w-11 h-11 flex items-center justify-center bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors relative"
            >
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="hidden lg:flex items-center gap-2 pl-3 border-l border-gray-200">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] flex items-center justify-center text-white text-sm font-semibold">
                {profile?.username ? profile.username.substring(0, 2).toUpperCase() : 'U'}
              </div>
              <span className="font-semibold text-gray-900 truncate max-w-[120px]">{profile?.username || 'User'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 pb-20 lg:pb-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Hero Banner */}
              <div className="relative overflow-hidden bg-white rounded-3xl p-8 lg:p-10 shadow-sm border border-gray-200">
                <div className="relative z-10">
                  <Badge className="bg-blue-50 text-blue-700 border-blue-100 mb-4 px-3 py-1">
                    {isAdmin ? 'SYSTEM ADMINISTRATOR' : 'LEARNER DASHBOARD'}
                  </Badge>
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                    {isAdmin ? 'Teja Admin Console' : `Ready to learn something new,\n${profile?.username || 'User'}?`}
                  </h1>
                  <p className="text-gray-600 mb-8 max-w-md">
                    {isAdmin
                      ? 'Welcome to the main control center. From here you can manage users, approve skills, and oversee all platform activity.'
                      : 'Explore new skills or manage your ongoing exchanges.'
                    }
                  </p>

                  {isAdmin ? (
                    <div className="flex flex-wrap gap-3">
                      {/* <Button onClick={() => onNavigate('skills-approval')} className="bg-blue-600 hover:bg-blue-700 rounded-full px-6 h-12 font-bold shadow-lg shadow-blue-900/20">
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Approve Skills
                      </Button>
                      <Button onClick={() => onNavigate('users')} variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-md rounded-full px-6 h-12 font-bold">
                        <Users className="w-4 h-4 mr-2" />
                        Manage Users
                      </Button> */}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-3">
                      <button
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 hover:bg-gray-50 rounded-full font-semibold transition-all shadow-md border border-gray-100"
                        onClick={() => onNavigate('discovery')}
                      >
                        Explore Skills
                        <ArrowRight className="w-4 h-4" />
                      </button>
                      <button
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white hover:bg-blue-700 rounded-full font-semibold transition-all shadow-md"
                        onClick={() => onNavigate('my-skills', { openAddModal: true })}
                      >
                        <Plus className="w-4 h-4" />
                        Add Skill
                      </button>
                    </div>
                  )}
                </div>
                {/* Decorative Pattern */}
                <div className="absolute right-0 bottom-0 p-8 opacity-10 hidden sm:block">
                  {isAdmin ? <ShieldCheck className="w-48 h-48 text-blue-500 rotate-12" /> : <BookOpen className="w-48 h-48 text-blue-500 rotate-12" />}
                </div>
              </div>

              {/* Admin Quick Actions Grid */}
              {isAdmin && (
                <div className="space-y-6">
                  {/* <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-blue-600" />
                      Management Quick Actions
                    </h2>
                  </div> */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                    <button
                      onClick={() => onNavigate('users')}
                      className="group p-6 bg-white rounded-3xl border border-gray-200 hover:border-blue-500 hover:shadow-xl transition-all text-left"
                    >
                      <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                        <Users className="w-6 h-6" />
                      </div>
                      <h3 className="font-bold text-gray-900 text-lg mb-1">User Directory</h3>
                      <p className="text-sm text-gray-500">Manage, block, or verify platform users and their profiles.</p>
                    </button>

                    <button
                      onClick={() => onNavigate('category')}
                      className="group p-6 bg-white rounded-3xl border border-gray-200 hover:border-indigo-500 hover:shadow-xl transition-all text-left"
                    >
                      <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-4 group-hover:scale-110 transition-transform">
                        <Layers className="w-6 h-6" />
                      </div>
                      <h3 className="font-bold text-gray-900 text-lg mb-1">Categories</h3>
                      <p className="text-sm text-gray-500">Organize and update skill categories for the marketplace.</p>
                    </button>

                    <button
                      onClick={() => onNavigate('skills-approval')}
                      className="group p-6 bg-white rounded-3xl border border-gray-200 hover:border-emerald-500 hover:shadow-xl transition-all text-left"
                    >
                      <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-4 group-hover:scale-110 transition-transform">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <h3 className="font-bold text-gray-900 text-lg mb-1">Skill Approvals</h3>
                      <p className="text-sm text-gray-500">Review pending skill submissions to maintain quality.</p>
                    </button>

                    <button
                      onClick={() => onNavigate('reported-users')}
                      className="group p-6 bg-white rounded-3xl border border-gray-200 hover:border-rose-500 hover:shadow-xl transition-all text-left"
                    >
                      <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600 mb-4 group-hover:scale-110 transition-transform">
                        <ShieldAlert className="w-6 h-6" />
                      </div>
                      <h3 className="font-bold text-gray-900 text-lg mb-1">Security & Reports</h3>
                      <p className="text-sm text-gray-500">Investigate user reports and take necessary moderation actions.</p>
                    </button>
                  </div>
                </div>
              )}

              {!isAdmin && (
                <>
                  {/* Your Offered Skills */}
                  <div>
                    <div className="flex items-center justify-between mb-4 mt-4">
                      <h2 className="text-xl font-bold text-gray-900">Your Offered Skills</h2>
                      <button onClick={() => onNavigate('my-skills')} className="text-sm font-semibold text-[#2563eb] hover:underline">View All</button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {offeredSkills?.slice(0, 4).map((skill: any) => (
                        <div key={skill.id} className="bg-white rounded-2xl p-5 border border-gray-200 hover:shadow-md transition-shadow flex items-start gap-4 cursor-pointer" onClick={() => onNavigate('skill-detail', skill)}>
                          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0"><Code className="w-6 h-6" /></div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-900 truncate">{skill.title}</h3>
                            <p className="text-xs text-gray-500 mb-2">{skill.category?.name || 'Skill'}</p>
                            <Badge variant="outline" className={`text-[10px] uppercase ${skill.approval_status === 'approved' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-yellow-50 text-yellow-700 border-yellow-100'}`}>{skill.approval_status}</Badge>
                          </div>
                        </div>
                      ))}
                      {(!offeredSkills || offeredSkills.length === 0) && (
                        <div className="col-span-full p-8 text-center bg-white rounded-2xl border border-dashed border-gray-300">
                          <Plus className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                          <p className="text-gray-500 text-sm">You haven't added any skills yet.</p>
                          <button onClick={() => onNavigate('my-skills', { openAddModal: true })} className="text-blue-600 font-semibold text-sm hover:underline mt-1">Add your first skill</button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
                      <button onClick={() => onNavigate('bookings')} className="text-sm font-semibold text-[#2563eb] hover:underline">View All</button>
                    </div>
                    <div className="space-y-3">
                      {recentBookings.map((booking: any) => (
                        <div key={booking.id} className="bg-white rounded-2xl p-4 border border-gray-200 flex items-center gap-4 hover:border-blue-200 transition-colors">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${booking.type === 'sent' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'}`}>
                            {booking.type === 'sent' ? <Send className="w-5 h-5" /> : <Download className="w-5 h-5" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">{booking.type === 'sent' ? `Requested ${booking.requested_skill?.title}` : `Received request for ${booking.requested_skill?.title}`}</p>
                            <p className="text-xs text-gray-500">{booking.type === 'sent' ? `From ${booking.provider?.username}` : `By ${booking.requester?.username}`} • {new Date(booking.createdAt).toLocaleDateString()}</p>
                          </div>
                          <Badge className={`text-[10px] capitalize ${booking.booking_status === 'complete' ? 'bg-green-50 text-green-700 border-green-100' : booking.booking_status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' : 'bg-gray-50 text-gray-600 border-gray-100'}`}>{booking.booking_status}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Right Column - Stats & Profile */}
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 opacity-50"></div>
                <h3 className="font-bold text-gray-900 mb-6 flex items-center justify-between relative z-10">
                  {isAdmin ? 'System Summary' : 'Dashboard Stats'}
                  <Badge variant="secondary" className="bg-blue-50 text-blue-700">Live</Badge>
                </h3>

                {isAdmin ? (
                  <div className="space-y-4 relative z-10">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Users className="w-5 h-5 text-slate-400" />
                        <span className="text-sm font-medium text-slate-600">Platform Users</span>
                      </div>
                      <span className="font-bold text-slate-900">Active</span>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Layers className="w-5 h-5 text-slate-400" />
                        <span className="text-sm font-medium text-slate-600">Categories</span>
                      </div>
                      <span className="font-bold text-slate-900">Managed</span>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4 relative z-10">
                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                      <p className="text-2xl font-bold text-gray-900">{stats?.totalBookings || 0}</p>
                      <p className="text-xs text-gray-500">Total Exchanges</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                      <p className="text-2xl font-bold text-blue-600">{stats?.offeredSkills || 0}</p>
                      <p className="text-xs text-gray-500">My Skills</p>
                    </div>
                  </div>
                )}

                <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 mx-auto mb-4 flex items-center justify-center text-black text-3xl font-bold shadow-lg ring-4 ring-white">
                    {profile?.username ? profile.username.substring(0, 2).toUpperCase() : 'U'}
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-1">Hi, {profile?.username || 'Admin'}!</h4>
                  <p className="text-xs text-gray-500 leading-relaxed mb-6">
                    {isAdmin ? 'You are logged in as a platform administrator.' : `You've completed ${stats?.totalBookings || 0} skill exchanges so far.`}
                  </p>
                  <Button variant="outline" className="w-full rounded-xl border-gray-200 hover:bg-gray-50" onClick={() => onNavigate('profile')}>
                    View Full Profile
                  </Button>
                </div>
              </div>

              {/* Admin Help / Settings */}
              {isAdmin && (
                <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Settings className="w-5 h-5 text-slate-400" />
                    System Tools
                  </h3>
                  <div className="space-y-2">
                    <button onClick={() => onNavigate('category')} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors group">
                      <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900">Manage Categories</span>
                      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500" />
                    </button>
                    <button onClick={() => onNavigate('profile')} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors group">
                      <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900">Profile Settings</span>
                      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="lg:hidden">
        <BottomNavigation activeScreen="dashboard" onNavigate={onNavigate} />
      </div>
    </div>
  );
}