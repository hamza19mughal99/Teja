import React, { useState } from 'react';
import { Bell, Search, ArrowRight, Heart, Code, Palette, Camera, Music, ChevronLeft, ChevronRight, UserPlus, MoreVertical, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import AddSkillForm from './AddSkillForm';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import BottomNavigation from './BottomNavigation';
import { Screen } from '../App';

interface DashboardScreenProps {
  onNavigate: (screen: Screen, data?: any) => void;
  user?: any;
}

interface SkillProgress {
  id: string;
  title: string;
  watched: number;
  total: number;
  icon: React.ReactNode;
  color: string;
}

interface ContinueSkill {
  id: string;
  title: string;
  category: string;
  mentor: string;
  mentorAvatar: string;
  image: string;
  categoryColor: string;
}

interface SkillRequest {
  id: string;
  mentor: string;
  mentorAvatar: string;
  type: string;
  description: string;
  date: string;
}

interface TopProvider {
  id: string;
  name: string;
  role: string;
  avatar: string;
  online: boolean;
}

export default function DashboardScreen({ onNavigate, user }: DashboardScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddSkillOpen, setIsAddSkillOpen] = useState(false);

  const skillProgress: SkillProgress[] = [
    { id: '1', title: 'UI/UX Design', watched: 2, total: 8, icon: <Palette className="w-5 h-5" />, color: 'from-purple-400 to-pink-400' },
    { id: '2', title: 'Branding', watched: 3, total: 8, icon: <Code className="w-5 h-5" />, color: 'from-pink-400 to-rose-400' },
    { id: '3', title: 'Front-End', watched: 6, total: 12, icon: <Code className="w-5 h-5" />, color: 'from-blue-400 to-cyan-400' },
  ];

  const continueSkills: ContinueSkill[] = [
    {
      id: '1',
      title: "Beginner's Guide to Becoming a Professional Front-End Developer",
      category: 'FRONT-END',
      mentor: 'Leonardo Samuel',
      mentorAvatar: 'LS',
      image: 'https://images.unsplash.com/photo-1627599936744-51d288f89af4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWIlMjBkZXNpZ24lMjB3b3Jrc3BhY2V8ZW58MXx8fHwxNzY3ODAwMzUxfDA&ixlib=rb-4.1.0&q=80&w=1080',
      categoryColor: 'text-blue-600 bg-blue-50',
    },
    {
      id: '2',
      title: 'Optimizing User Experience with the Best UI/UX Design',
      category: 'UI/UX DESIGN',
      mentor: 'Rayu Satrio',
      mentorAvatar: 'RS',
      image: 'https://images.unsplash.com/photo-1511629091441-ee46146481b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjB0ZWFjaGluZyUyMGNvZGluZ3xlbnwxfHx8fDE3Njc5MDQ1OTZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      categoryColor: 'text-purple-600 bg-purple-50',
    },
    {
      id: '3',
      title: 'Reviving and Refresh Company Image',
      category: 'BRANDING',
      mentor: 'Padhang Satrio',
      mentorAvatar: 'PS',
      image: 'https://images.unsplash.com/photo-1758524944402-1903b38f848f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxndWl0YXIlMjBtdXNpYyUyMGxlc3NvbnxlbnwxfHx8fDE3Njc5MDQ1OTZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      categoryColor: 'text-pink-600 bg-pink-50',
    },
  ];

  const skillRequests: SkillRequest[] = [
    {
      id: '1',
      mentor: 'Padhang Satrio',
      mentorAvatar: 'PS',
      type: 'UI/UX DESIGN',
      description: 'Understand Of UI/UX Design',
      date: '2/16/2004',
    },
  ];

  const topProviders: TopProvider[] = [
    { id: '1', name: 'Padhang Satrio', role: 'Mentor', avatar: 'PS', online: true },
    { id: '2', name: 'Zakir Hozenthal', role: 'Mentor', avatar: 'ZH', online: true },
    { id: '3', name: 'Leonardo Samuel', role: 'Mentor', avatar: 'LS', online: true },
  ];

  // Mock data for weekly stats
  const weeklyStats = [
    { day: '1-10 Aug', value: 20 },
    { day: '11-20 Aug', value: 40 },
    { day: '21-30 Aug', value: 30 },
    { day: '31-40 Aug', value: 60 },
    { day: '41-50 Aug', value: 50 },
  ];
  const maxValue = Math.max(...weeklyStats.map(s => s.value));

  return (
    <div className="h-full flex flex-col bg-gray-50 overflow-y-auto">
      {/* Top Bar with Search */}
      <div className="bg-white border-b border-gray-200 px-6 lg:px-8 xl:px-12 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search your skills..."
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
            <button className="w-11 h-11 flex items-center justify-center bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors">
              <MoreVertical className="w-5 h-5 text-gray-600" />
            </button>
            <div className="hidden lg:flex items-center gap-2 pl-3 border-l border-gray-200">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] flex items-center justify-center text-white text-sm font-semibold">
                {user?.username ? user.username.substring(0, 2).toUpperCase() : 'U'}
              </div>
              <span className="font-semibold text-gray-900 truncate max-w-[120px]">{user?.username || 'User'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 pb-20 lg:pb-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 xl:px-12 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Hero Banner */}
              <div className="relative overflow-hidden bg-gradient-to-br from-[#6366f1] via-[#8b5cf6] to-[#a855f7] rounded-3xl p-8 lg:p-10">
                <div className="relative z-10">
                  <p className="text-xs font-semibold text-white/80 tracking-wider mb-3">ONLINE SKILLS</p>
                  <h1 className="text-3xl lg:text-4xl font-bold text-white mb-6 leading-tight">
                    Sharpen Your Skills with<br />Professional Skill Exchange
                  </h1>
                  <button className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-full font-semibold transition-all shadow-lg">
                    Join Now
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
                {/* Decorative Line Pattern */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-20">
                  <div className="w-64 h-px bg-white"></div>
                  <div className="w-64 h-px bg-white mt-20"></div>
                </div>
              </div>

              {/* Progress Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {skillProgress.map((skill) => (
                  <div key={skill.id} className="bg-white rounded-2xl p-5 border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${skill.color} flex items-center justify-center text-white`}>
                        {skill.icon}
                      </div>
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mb-1">{skill.watched}/{skill.total} watched</p>
                    <p className="font-semibold text-gray-900">{skill.title}</p>
                  </div>
                ))}
              </div>

              {/* Continue Exploring */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Continue Exploring</h2>
                  <div className="flex items-center gap-2">
                    <button className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full transition-colors">
                      <ChevronLeft className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center bg-[#2563eb] hover:bg-[#1d4ed8] rounded-full transition-colors">
                      <ChevronRight className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {continueSkills.map((skill) => (
                    <div key={skill.id} className="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-lg transition-all group cursor-pointer">
                      <div className="relative h-40 overflow-hidden bg-gray-100">
                        <img src={skill.image} alt={skill.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        <button className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full flex items-center justify-center transition-colors">
                          <Heart className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                      <div className="p-4">
                        <Badge className={`${skill.categoryColor} text-xs font-semibold mb-2`}>
                          {skill.category}
                        </Badge>
                        <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2 leading-snug">
                          {skill.title}
                        </h3>
                        <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] flex items-center justify-center text-white text-xs font-semibold">
                            {skill.mentorAvatar}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-900 font-medium">{skill.mentor}</p>
                            <p className="text-xs text-gray-500">Mentor</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Your Requests */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Your Requests</h2>
                  <button className="text-sm font-semibold text-[#2563eb] hover:text-[#1d4ed8]">
                    See all
                  </button>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                  {/* Table Header */}
                  <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <div className="col-span-3">Mentor</div>
                    <div className="col-span-3">Type</div>
                    <div className="col-span-4">Description</div>
                    <div className="col-span-2">Action</div>
                  </div>

                  {/* Table Rows */}
                  {skillRequests.map((request) => (
                    <div key={request.id} className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                      <div className="col-span-3 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                          {request.mentorAvatar}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900">{request.mentor}</p>
                          <p className="text-xs text-gray-500">{request.date}</p>
                        </div>
                      </div>
                      <div className="col-span-3 flex items-center">
                        <Badge className="text-purple-600 bg-purple-50 text-xs font-semibold">
                          {request.type}
                        </Badge>
                      </div>
                      <div className="col-span-4 flex items-center">
                        <p className="text-sm text-gray-700">{request.description}</p>
                      </div>
                      <div className="col-span-2 flex items-center">
                        <button className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full transition-colors">
                          <ArrowRight className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              <Button
                className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-2xl h-12 lg:h-14 font-semibold shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)] hover:-translate-y-0.5 transition-all text-base lg:text-lg"
                onClick={() => onNavigate('my-skills', { openAddModal: true })}
              >
                <Plus className="w-5 h-5 lg:w-6 lg:h-6 mr-2" />
                Add your skills
              </Button>

              {/* Statistics Card */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900">Statistic</h3>
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>

                {/* Avatar with Badge */}
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] flex items-center justify-center text-white text-2xl font-bold border-4 border-white shadow-lg uppercase">
                      {user?.username ? user.username.substring(0, 2) : 'U'}
                    </div>
                    <div className="absolute -top-1 -right-1 bg-[#2563eb] text-white text-xs font-bold px-2 py-1 rounded-full">
                      90%
                    </div>
                  </div>
                </div>

                <div className="text-center mb-6">
                  <h4 className="text-lg font-bold text-gray-900 mb-1">Good Morning {user?.username || 'User'} 🔥</h4>
                  <p className="text-xs text-gray-500">Continue your learning to achieve your target!</p>
                </div>

                {/* Bar Chart */}
                <div className="space-y-2">
                  <div className="flex items-end justify-between h-32 gap-2">
                    {weeklyStats.map((stat, index) => (
                      <div key={index} className="flex-1 flex flex-col items-center gap-2">
                        <div className="w-full bg-gray-100 rounded-lg overflow-hidden flex items-end" style={{ height: '100%' }}>
                          <div
                            className={`w-full rounded-t-lg transition-all ${index === 3 ? 'bg-[#2563eb]' : 'bg-gray-300'}`}
                            style={{ height: `${(stat.value / maxValue) * 100}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-400 text-center leading-tight">{stat.day.split(' ')[0]}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 text-center pt-2">Skills Exchanged This Month</p>
                </div>
              </div>

              {/* Your Mentor */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900">Top Providers</h3>
                  <button className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full transition-colors">
                    <UserPlus className="w-4 h-4 text-gray-600" />
                  </button>
                </div>

                <div className="space-y-3">
                  {topProviders.map((provider) => (
                    <div key={provider.id} className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] flex items-center justify-center text-white text-sm font-semibold">
                          {provider.avatar}
                        </div>
                        {provider.online && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900">{provider.name}</p>
                        <p className="text-xs text-gray-500">{provider.role}</p>
                      </div>
                      <button className="text-xs font-semibold text-[#2563eb] hover:text-[#1d4ed8] flex items-center gap-1">
                        <UserPlus className="w-3.5 h-3.5" />
                        Follow
                      </button>
                    </div>
                  ))}
                </div>

                <button className="w-full mt-4 py-2 text-sm font-semibold text-[#2563eb] hover:text-[#1d4ed8] border-t border-gray-100 pt-4">
                  See All
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation - Mobile Only */}
      <div className="lg:hidden">
        <BottomNavigation activeScreen="dashboard" onNavigate={onNavigate} />
      </div>
    </div>
  );
}