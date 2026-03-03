import { Clock, Eye, Star, Users, Loader2, Search, SlidersHorizontal, ChevronUp, ChevronDown } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Screen, SkillData } from '../App';
import { apiService } from '../services/apiService';
import { RootState } from '../store';
import BottomNavigation from './BottomNavigation';
import { Badge } from './ui/badge';
import { Input } from './ui/input';

interface DiscoveryScreenProps {
  onNavigate: (screen: Screen) => void;
  onSelectSkill: (skill: any) => void;
}

export default function DiscoveryScreen({ onNavigate, onSelectSkill }: DiscoveryScreenProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [skills, setSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // We can also fetch categories dynamically if needed, but let's keep static categories or derive from data
  const [categories, setCategories] = useState<string[]>(['All']);

  const { user } = useSelector((state: RootState) => state.auth);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const res = await apiService.getAllSkills();
      if (res?.data) {
        // Filter out current user's skills and only show approved ones
        const otherSkills = res.data.filter((s: any) => s.user?.id !== user?.id && s.approval_status === 'approved');

        // Extract unique categories
        const cats = new Set<string>();
        cats.add('All');
        otherSkills.forEach((s: any) => {
          if (s.category?.name) cats.add(s.category.name);
        });
        setCategories(Array.from(cats));

        setSkills(otherSkills);
      }
    } catch (err) {
      console.error("Failed to fetch skills:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, [user?.id]);

  const filteredSkills = skills.filter((skill) => {
    const titleMatch = skill.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const userMatch = skill.user?.username?.toLowerCase().includes(searchQuery.toLowerCase());
    const descMatch = skill.description_text?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSearch = titleMatch || userMatch || descMatch;
    const matchesCategory = selectedCategory === 'All' || skill.category?.name === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-white">
        <Loader2 className="w-8 h-8 animate-spin text-[#2563eb]" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white overflow-y-auto">
      {/* Header */}
      <div className="px-6 lg:px-8 xl:px-12 pt-8 pb-6 bg-gradient-to-b from-purple-50 to-transparent border-b border-gray-100 top-0 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Discover Skills</h2>
              <p className="text-sm text-gray-500 mt-1">Browse skills offered by other users</p>
            </div>

            {/* <div className="flex items-center gap-2 bg-white rounded-xl shadow-sm border border-gray-200 p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${viewMode === 'grid' ? 'bg-[#2563eb] text-white shadow' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${viewMode === 'list' ? 'bg-[#2563eb] text-white shadow' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                List
              </button>
            </div> */}
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by skill title or provider..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-12 pr-4 bg-white border-gray-200 rounded-xl"
            />
          </div>

          {/* Category Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 text-sm rounded-full whitespace-nowrap transition-colors ${selectedCategory === category
                  ? 'bg-[#2563eb] text-white shadow-sm'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Skills List */}
      <div className="flex-1 pb-20 lg:pb-8 px-6 lg:px-8 xl:px-12 pt-6 bg-gray-50/50">
        <div className="max-w-7xl mx-auto">
          {filteredSkills.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-2">No skills found matching your criteria.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="text-sm text-[#2563eb] font-medium hover:underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <>
              {/* Grid View */}
              {viewMode === 'grid' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredSkills.map((skill) => (
                    <SkillCardGrid
                      key={skill.id}
                      skill={skill}
                      onClick={() => onSelectSkill(skill)}
                    />
                  ))}
                </div>
              )}

              {/* List View */}
              {viewMode === 'list' && (
                <div className="space-y-4">
                  {filteredSkills.map((skill) => (
                    <SkillCardList
                      key={skill.id}
                      skill={skill}
                      onClick={() => onSelectSkill(skill)}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Bottom Navigation - Mobile Only */}
      <div className="lg:hidden z-20">
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

const getImageSrc = (skill: any) => {
  if (skill.images && skill.images.length > 0) {
    return skill.images[0].formats?.thumbnail?.url || skill.images[0].formats?.small?.url || skill.images[0].url;
  }
  return "https://images.unsplash.com/photo-1517048676732-d65bc937f952?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFjaGluZ3xlbnwxfHx8fDE3Njc5MDQ1OTZ8MA&ixlib=rb-4.1.0&q=80&w=1080";
};

// Skill Card Grid Component
function SkillCardGrid({
  skill,
  onClick,
}: {
  skill: any;
  onClick: () => void;
}) {
  return (
    <div
      className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col h-full hover:-translate-y-1"
      onClick={onClick}
    >
      <div className="relative h-48 overflow-hidden bg-gray-100 flex-shrink-0">
        <img src={getImageSrc(skill)} alt={skill.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1.5 rounded-full flex items-center gap-1 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
          <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-500" />
          <span className="text-xs font-bold text-gray-900">{skill.rating_sum || 'New'}</span>
        </div>
        <div className="absolute bottom-3 left-3 flex gap-2">
          {skill.category && (
            <Badge className="bg-white/95 backdrop-blur-sm text-gray-800 shadow-sm border-none font-medium px-2.5 py-1">
              {skill.category.name}
            </Badge>
          )}
        </div>
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <div className="mb-2">
          <h3 className="font-bold text-gray-900 line-clamp-1 text-[1.05rem]">{skill.title}</h3>
        </div>

        <p className="text-sm text-gray-500 mb-4 line-clamp-2 leading-relaxed flex-grow">{skill.description_text}</p>

        <div className="flex items-center gap-3 pt-3.5 border-t border-gray-100 mt-auto">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs flex-shrink-0 shadow-sm">
            {skill.user?.username ? skill.user.username.substring(0, 2).toUpperCase() : 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{skill.user?.username || 'Unknown Provider'}</p>
            {skill.location && <p className="text-[11px] font-medium text-gray-500 truncate mt-0.5">{skill.location}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

// Skill Card List Component
function SkillCardList({
  skill,
  onClick,
}: {
  skill: any;
  onClick: () => void;
}) {
  return (
    <div
      className="bg-white border border-gray-200 rounded-2xl p-3.5 sm:p-4 hover:shadow-md transition-all cursor-pointer group hover:-translate-y-0.5"
      onClick={onClick}
    >
      <div className="flex gap-4 sm:gap-5 flex-col sm:flex-row">
        <div className="relative w-full sm:w-[150px] sm:h-[110px] h-48 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
          <img
            src={getImageSrc(skill)}
            alt={skill.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        <div className="flex-1 min-w-0 flex flex-col pt-1">
          <div className="flex items-start justify-between mb-1 gap-3">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1.5 leading-tight">{skill.title}</h3>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <Badge variant="secondary" className="text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 border-none px-2.5 py-0.5">
                  {skill.category?.name || 'Uncategorized'}
                </Badge>
                {skill.skill_level && (
                  <Badge variant="outline" className="text-xs text-gray-600 border-gray-200 px-2 py-0.5 font-medium">
                    {skill.skill_level}
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1.5 bg-yellow-50/80 border border-yellow-100 text-yellow-700 px-2.5 py-1.5 rounded-lg shadow-sm flex-shrink-0">
              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-500" />
              <span className="text-sm font-bold">{skill.rating_sum || 'New'}</span>
            </div>
          </div>

          <p className="text-sm text-gray-500 mb-4 line-clamp-2 leading-relaxed max-w-2xl">
            {skill.description_text}
          </p>

          <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-50">
            <div className="flex items-center gap-2.5 max-w-[60%]">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs flex-shrink-0 shadow-sm">
                {skill.user?.username ? skill.user.username.substring(0, 1).toUpperCase() : 'U'}
              </div>
              <span className="text-sm font-semibold text-gray-900 truncate">
                {skill.user?.username || 'Unknown Provider'}
              </span>
            </div>

            {skill.location && (
              <div className="text-xs font-medium text-gray-500 truncate flex-1 text-right ml-2 flex items-center justify-end gap-1">
                <span className="truncate">{skill.location}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}