import React, { useState } from 'react';
import { Search, SlidersHorizontal, Star, ChevronDown, ChevronUp } from 'lucide-react';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import BottomNavigation from './BottomNavigation';
import { Screen, SkillData } from '../App';

interface DiscoveryScreenProps {
  onNavigate: (screen: Screen) => void;
  onSelectSkill: (skill: SkillData) => void;
}

export default function DiscoveryScreen({ onNavigate, onSelectSkill }: DiscoveryScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  const categories = ['All', 'IT', 'Arts', 'Business', 'Language', 'Household'];

  const skills: SkillData[] = [
    {
      id: '1',
      title: 'Web Design',
      category: 'IT',
      provider: {
        name: 'Sarah Mitchell',
        avatar: 'SM',
        verified: true,
      },
      rating: 4.8,
      reviewCount: 24,
      creditHours: 2,
      level: 'Intermediate',
      location: 'Online/Remote',
      language: 'English',
      description: 'Learn modern web design principles, UI/UX best practices, and how to create beautiful, responsive websites.',
      availability: 'Weekends only',
      image: 'https://images.unsplash.com/photo-1542744095-70fccefd4b65?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWIlMjBkZXNpZ24lMjBjb21wdXRlcnxlbnwxfHx8fDE3Njc5MDIwMDF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: '2',
      title: 'Guitar Lessons',
      category: 'Arts',
      provider: {
        name: 'James Chen',
        avatar: 'JC',
        verified: true,
      },
      rating: 4.9,
      reviewCount: 38,
      creditHours: 1,
      level: 'Beginner',
      location: 'In-Person/Austin, TX',
      language: 'English',
      description: 'Beginner-friendly guitar lessons covering chords, strumming patterns, and popular songs.',
      availability: 'Evenings and weekends',
      image: 'https://images.unsplash.com/photo-1758524944402-1903b38f848f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxndWl0YXIlMjBtdXNpYyUyMGxlc3NvbnxlbnwxfHx8fDE3Njc4MDgxNjd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: '3',
      title: 'Photography',
      category: 'Arts',
      provider: {
        name: 'Emma Wilson',
        avatar: 'EW',
        verified: true,
      },
      rating: 4.7,
      reviewCount: 19,
      creditHours: 2,
      level: 'Intermediate',
      location: 'Online/Remote',
      language: 'English',
      description: 'Master the art of photography, from composition to lighting and post-processing techniques.',
      availability: 'Flexible',
      image: 'https://images.unsplash.com/photo-1622319977720-9949ac28adc4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaG90b2dyYXBoeSUyMGNhbWVyYXxlbnwxfHx8fDE3Njc3OTE3NzZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: '4',
      title: 'Cooking Basics',
      category: 'Household',
      provider: {
        name: 'David Lee',
        avatar: 'DL',
        verified: false,
      },
      rating: 4.6,
      reviewCount: 15,
      creditHours: 1.5,
      level: 'Beginner',
      location: 'In-Person/Seattle, WA',
      language: 'English',
      description: 'Learn essential cooking techniques, knife skills, and how to prepare delicious meals.',
      availability: 'Weekday afternoons',
      image: 'https://images.unsplash.com/photo-1636647511729-6703539ba71f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb29raW5nJTIwa2l0Y2hlbnxlbnwxfHx8fDE3Njc4NTcyNzl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: '5',
      title: 'Yoga & Meditation',
      category: 'Arts',
      provider: {
        name: 'Maria Garcia',
        avatar: 'MG',
        verified: true,
      },
      rating: 5.0,
      reviewCount: 42,
      creditHours: 1,
      level: 'All Levels',
      location: 'Online/Remote',
      language: 'English, Spanish',
      description: 'Gentle yoga flows and meditation practices for stress relief and mindfulness.',
      availability: 'Morning sessions',
      image: 'https://images.unsplash.com/photo-1641971215228-c677f3a28cd8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2dhJTIwZml0bmVzc3xlbnwxfHx8fDE3Njc4MTE1OTd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: '6',
      title: 'Spanish Tutoring',
      category: 'Language',
      provider: {
        name: 'Carlos Rodriguez',
        avatar: 'CR',
        verified: true,
      },
      rating: 4.8,
      reviewCount: 31,
      creditHours: 1,
      level: 'Beginner to Advanced',
      location: 'Online/Remote',
      language: 'Spanish, English',
      description: 'Conversational Spanish lessons tailored to your level and learning goals.',
      availability: 'Very flexible',
      image: 'https://images.unsplash.com/photo-1673515334669-1e445e4f4c3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYW5ndWFnZSUyMGxlYXJuaW5nfGVufDF8fHx8MTc2Nzg0ODI4MHww&ixlib=rb-4.1.0&q=80&w=1080',
    },
  ];

  const filteredSkills = skills.filter(skill => {
    const matchesSearch = skill.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         skill.provider.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || skill.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="h-full flex flex-col bg-white overflow-y-auto">
      {/* Header with Search */}
      <div className="px-6 lg:px-8 xl:px-12 pt-8 pb-6 bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">Discover Skills</h2>
          
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Find a skill to learn..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-12 pr-4 bg-gray-50 border-gray-200 rounded-xl"
            />
          </div>

          {/* Category Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                  selectedCategory === category
                    ? 'bg-[#2563eb] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Advanced Filters Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 mt-3 text-sm text-[#2563eb] hover:underline"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Advanced Filters
            {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {/* Advanced Filters Panel */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Location Radius (miles)
                </label>
                <input
                  type="range"
                  min="0"
                  max="50"
                  defaultValue="25"
                  className="w-full accent-[#2563eb]"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0</span>
                  <span>25</span>
                  <span>50+</span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Proficiency Level
                </label>
                <select className="w-full h-10 px-3 bg-white border border-gray-200 rounded-lg">
                  <option>All Levels</option>
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Skills Grid */}
      <div className="flex-1 pb-20 lg:pb-8 px-6 lg:px-8 xl:px-12 pt-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredSkills.map((skill) => (
              <button
                key={skill.id}
                onClick={() => onSelectSkill(skill)}
                className="flex flex-col bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:scale-105 transition-all text-left"
              >
                {/* Skill Image */}
                <div className="relative h-32 lg:h-40 overflow-hidden bg-gray-200">
                  <img
                    src={skill.image}
                    alt={skill.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-semibold">{skill.rating}</span>
                  </div>
                </div>

                {/* Skill Info */}
                <div className="p-3">
                  <h4 className="font-semibold text-gray-900 mb-1 line-clamp-1">{skill.title}</h4>
                  <p className="text-xs text-gray-500 mb-2 line-clamp-1">{skill.provider.name}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-xs bg-blue-50 text-[#2563eb] border-blue-200">
                      {skill.creditHours} hrs
                    </Badge>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation - Mobile Only */}
      <div className="lg:hidden">
        <BottomNavigation activeScreen="discovery" onNavigate={onNavigate} />
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}