import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Eye, TrendingUp, Users, Clock, Star, MoreVertical } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import BottomNavigation from './BottomNavigation';
import { Screen } from '../App';

interface MySkillsScreenProps {
  onNavigate: (screen: Screen) => void;
}

interface Skill {
  id: string;
  title: string;
  category: string;
  description: string;
  level: string;
  creditHours: number;
  image: string;
  status: 'active' | 'paused';
  views: number;
  requests: number;
  completedSessions: number;
  rating: number;
  reviewCount: number;
}

export default function MySkillsScreen({ onNavigate }: MySkillsScreenProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const [mySkills, setMySkills] = useState<Skill[]>([
    {
      id: '1',
      title: 'Python Programming',
      category: 'IT',
      description: 'Teach Python basics, data structures, and object-oriented programming concepts.',
      level: 'Intermediate',
      creditHours: 2,
      image: 'https://images.unsplash.com/photo-1667372531881-6f975b1c86db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxweXRob24lMjBwcm9ncmFtbWluZyUyMGNvZGV8ZW58MXx8fHwxNzY3ODE0NDY2fDA&ixlib=rb-4.1.0&q=80&w=1080',
      status: 'active',
      views: 342,
      requests: 15,
      completedSessions: 24,
      rating: 4.8,
      reviewCount: 18,
    },
    {
      id: '2',
      title: 'Graphic Design',
      category: 'Arts',
      description: 'Adobe Creative Suite, branding, and visual design principles.',
      level: 'Advanced',
      creditHours: 1.5,
      image: 'https://images.unsplash.com/photo-1740174459699-487aec1f7bc5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmFwaGljJTIwZGVzaWduJTIwdG9vbHN8ZW58MXx8fHwxNzY3ODU2NTA5fDA&ixlib=rb-4.1.0&q=80&w=1080',
      status: 'active',
      views: 289,
      requests: 12,
      completedSessions: 19,
      rating: 4.9,
      reviewCount: 15,
    },
    {
      id: '3',
      title: 'Content Writing',
      category: 'Business',
      description: 'SEO writing, blog posts, copywriting, and content strategy.',
      level: 'Intermediate',
      creditHours: 1,
      image: 'https://images.unsplash.com/photo-1758874385949-cec80d549f67?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250ZW50JTIwd3JpdGluZyUyMGxhcHRvcHxlbnwxfHx8fDE3Njc4NjcxNTJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      status: 'paused',
      views: 156,
      requests: 8,
      completedSessions: 12,
      rating: 4.7,
      reviewCount: 9,
    },
    {
      id: '4',
      title: 'Marketing Strategy',
      category: 'Business',
      description: 'Digital marketing, social media strategy, and growth hacking.',
      level: 'Advanced',
      creditHours: 2,
      image: 'https://images.unsplash.com/photo-1707301280380-56f7e7a00aef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXJrZXRpbmclMjBzdHJhdGVneSUyMGJ1c2luZXNzfGVufDF8fHx8MTc2Nzg1MzA4OXww&ixlib=rb-4.1.0&q=80&w=1080',
      status: 'active',
      views: 421,
      requests: 22,
      completedSessions: 31,
      rating: 5.0,
      reviewCount: 24,
    },
  ]);

  const totalStats = {
    totalSkills: mySkills.length,
    activeSkills: mySkills.filter(s => s.status === 'active').length,
    totalViews: mySkills.reduce((sum, s) => sum + s.views, 0),
    totalRequests: mySkills.reduce((sum, s) => sum + s.requests, 0),
    totalCompleted: mySkills.reduce((sum, s) => sum + s.completedSessions, 0),
  };

  const handleToggleStatus = (skillId: string) => {
    setMySkills(mySkills.map(skill => 
      skill.id === skillId 
        ? { ...skill, status: skill.status === 'active' ? 'paused' as const : 'active' as const }
        : skill
    ));
  };

  const handleDeleteSkill = (skillId: string) => {
    setMySkills(mySkills.filter(skill => skill.id !== skillId));
  };

  return (
    <div className="h-full flex flex-col bg-white overflow-y-auto">
      {/* Header */}
      <div className="px-6 lg:px-8 xl:px-12 pt-8 pb-6 bg-gradient-to-b from-purple-50 to-transparent border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">My Skills</h2>
              <p className="text-sm text-gray-500 mt-1">Manage your offered skills and track performance</p>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-xl h-11 px-6">
                  <Plus className="w-5 h-5 mr-2" />
                  Add New Skill
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Skill</DialogTitle>
                </DialogHeader>
                <AddSkillForm onClose={() => setIsAddDialogOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="p-4 bg-white rounded-xl border border-gray-200">
              <p className="text-2xl font-bold text-gray-900">{totalStats.totalSkills}</p>
              <p className="text-xs text-gray-600 mt-1">Total Skills</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
              <p className="text-2xl font-bold text-green-700">{totalStats.activeSkills}</p>
              <p className="text-xs text-gray-600 mt-1">Active</p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-gray-200">
              <p className="text-2xl font-bold text-gray-900">{totalStats.totalViews}</p>
              <p className="text-xs text-gray-600 mt-1">Total Views</p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-gray-200">
              <p className="text-2xl font-bold text-gray-900">{totalStats.totalRequests}</p>
              <p className="text-xs text-gray-600 mt-1">Requests</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
              <p className="text-2xl font-bold text-[#2563eb]">{totalStats.totalCompleted}</p>
              <p className="text-xs text-gray-600 mt-1">Completed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Skills List */}
      <div className="flex-1 pb-20 lg:pb-8 px-6 lg:px-8 xl:px-12 pt-6">
        <div className="max-w-7xl mx-auto">
          {/* View Toggle & Filters */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-[#2563eb] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-[#2563eb] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                List
              </button>
            </div>
            <select className="h-10 px-3 bg-white border border-gray-200 rounded-lg text-sm">
              <option>All Status</option>
              <option>Active</option>
              <option>Paused</option>
            </select>
          </div>

          {/* Grid View */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mySkills.map((skill) => (
                <SkillCardGrid 
                  key={skill.id} 
                  skill={skill} 
                  onToggleStatus={handleToggleStatus}
                  onDelete={handleDeleteSkill}
                />
              ))}
            </div>
          )}

          {/* List View */}
          {viewMode === 'list' && (
            <div className="space-y-4">
              {mySkills.map((skill) => (
                <SkillCardList 
                  key={skill.id} 
                  skill={skill} 
                  onToggleStatus={handleToggleStatus}
                  onDelete={handleDeleteSkill}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation - Mobile Only */}
      <div className="lg:hidden">
        <BottomNavigation activeScreen="my-skills" onNavigate={onNavigate} />
      </div>
    </div>
  );
}

// Skill Card Grid Component
function SkillCardGrid({ 
  skill, 
  onToggleStatus, 
  onDelete 
}: { 
  skill: Skill; 
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all">
      <div className="relative h-40">
        <img src={skill.image} alt={skill.title} className="w-full h-full object-cover" />
        <Badge 
          className={`absolute top-3 right-3 ${
            skill.status === 'active' 
              ? 'bg-green-100 text-green-700 border-green-200' 
              : 'bg-gray-100 text-gray-700 border-gray-200'
          }`}
        >
          {skill.status === 'active' ? 'Active' : 'Paused'}
        </Badge>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1">{skill.title}</h3>
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">{skill.description}</p>
        
        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-4 text-center">
          <div className="p-2 bg-gray-50 rounded-lg">
            <p className="text-sm font-bold text-gray-900">{skill.views}</p>
            <p className="text-xs text-gray-500">Views</p>
          </div>
          <div className="p-2 bg-gray-50 rounded-lg">
            <p className="text-sm font-bold text-gray-900">{skill.requests}</p>
            <p className="text-xs text-gray-500">Requests</p>
          </div>
          <div className="p-2 bg-gray-50 rounded-lg">
            <p className="text-sm font-bold text-gray-900">{skill.rating}</p>
            <p className="text-xs text-gray-500">Rating</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            onClick={() => onToggleStatus(skill.id)}
            variant="outline"
            className="flex-1 h-9 text-sm"
          >
            {skill.status === 'active' ? 'Pause' : 'Activate'}
          </Button>
          <Button variant="outline" className="h-9 px-3">
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button 
            variant="outline" 
            className="h-9 px-3 text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => onDelete(skill.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// Skill Card List Component
function SkillCardList({ 
  skill, 
  onToggleStatus,
  onDelete 
}: { 
  skill: Skill; 
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-md transition-all">
      <div className="flex gap-4">
        <img 
          src={skill.image} 
          alt={skill.title} 
          className="w-24 h-24 lg:w-32 lg:h-32 rounded-xl object-cover flex-shrink-0"
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">{skill.title}</h3>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="text-xs">
                  {skill.category}
                </Badge>
                <Badge 
                  className={`text-xs ${
                    skill.status === 'active' 
                      ? 'bg-green-100 text-green-700 border-green-200' 
                      : 'bg-gray-100 text-gray-700 border-gray-200'
                  }`}
                >
                  {skill.status}
                </Badge>
              </div>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">{skill.description}</p>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{skill.views} views</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{skill.requests} requests</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{skill.completedSessions} completed</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span>{skill.rating} ({skill.reviewCount})</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => onToggleStatus(skill.id)}
              variant="outline"
              className="h-9 text-sm"
            >
              {skill.status === 'active' ? 'Pause' : 'Activate'}
            </Button>
            <Button variant="outline" className="h-9 px-4 text-sm">
              <Edit2 className="w-4 h-4 mr-1" />
              Edit
            </Button>
            <Button 
              variant="outline" 
              className="h-9 px-4 text-sm text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => onDelete(skill.id)}
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Add Skill Form Component
function AddSkillForm({ onClose }: { onClose: () => void }) {
  return (
    <form className="space-y-4">
      <div>
        <label className="text-sm font-medium mb-2 block">Skill Title</label>
        <Input placeholder="e.g., Web Development" className="h-11" />
      </div>
      
      <div>
        <label className="text-sm font-medium mb-2 block">Category</label>
        <Select>
          <SelectTrigger className="h-11">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="it">IT</SelectItem>
            <SelectItem value="arts">Arts</SelectItem>
            <SelectItem value="business">Business</SelectItem>
            <SelectItem value="language">Language</SelectItem>
            <SelectItem value="household">Household</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Proficiency Level</label>
        <Select>
          <SelectTrigger className="h-11">
            <SelectValue placeholder="Select level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="beginner">Beginner</SelectItem>
            <SelectItem value="intermediate">Intermediate</SelectItem>
            <SelectItem value="advanced">Advanced</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Credit Hours</label>
        <Input type="number" step="0.5" placeholder="1.5" className="h-11" />
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Description</label>
        <Textarea 
          placeholder="Describe what you'll teach and what students will learn..."
          className="min-h-24 resize-none"
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onClose} className="flex-1 h-11">
          Cancel
        </Button>
        <Button type="submit" className="flex-1 h-11 bg-[#2563eb] hover:bg-[#1d4ed8]">
          Add Skill
        </Button>
      </div>
    </form>
  );
}
