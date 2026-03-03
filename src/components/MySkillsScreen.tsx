import { Clock, Edit2, Eye, Plus, Star, Trash2, Users, Loader2 } from 'lucide-react';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Screen } from '../App';
import { apiService } from '../services/apiService';
import { RootState } from '../store';
import AddSkillForm from './AddSkillForm';
import BottomNavigation from './BottomNavigation';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';

interface MySkillsScreenProps {
  onNavigate: (screen: Screen, data?: any) => void;
  initialData?: any;
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

export default function MySkillsScreen({ onNavigate, initialData }: MySkillsScreenProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mySkills, setMySkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const { user } = useSelector((state: RootState) => state.auth);

  const fetchMySkills = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const res = await apiService.getMySkills(user.id);
      if (res?.data) {
        const approvedSkills = res.data.filter((s: any) => s.approval_status === 'approved');
        setMySkills(approvedSkills);
      }
    } catch (err) {
      console.error("Failed to fetch my skills:", err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchMySkills();
  }, [user?.id]);

  React.useEffect(() => {
    if (initialData?.openAddModal) {
      setIsAddDialogOpen(true);
    }
  }, [initialData]);

  const totalStats = {
    totalSkills: mySkills.length,
    activeSkills: mySkills.filter(s => s.approval_status === 'approved').length,
    totalViews: mySkills.reduce((sum, s) => sum + (s.total_requests || 0), 0),
    totalRequests: mySkills.reduce((sum, s) => sum + (s.total_requests || 0), 0),
    totalCompleted: mySkills.reduce((sum, s) => sum + (s.total_completed || 0), 0),
  };

  const handleToggleStatus = (skillId: string) => {
    // Left unimplemented for API as per original dummy spec, no API mentioned for toggle
  };

  const handleDeleteSkill = async (documentId: string) => {
    try {
      setActionLoading(`delete-${documentId}`);
      await apiService.deleteSkill(documentId);
      setMySkills(mySkills.filter(skill => skill.documentId !== documentId));
      setDeleteConfirm(null);
    } catch (err: any) {
      alert(err || 'Failed to delete skill');
    } finally {
      setActionLoading(null);
    }
  };

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
                <AddSkillForm onClose={() => setIsAddDialogOpen(false)} user={user} onSuccess={fetchMySkills} />
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats Overview */}
          {/* <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
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
          </div> */}
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
                className={`px-4 py-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-[#2563eb] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-[#2563eb] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                List
              </button>
            </div>
            {/* <select className="h-10 px-3 bg-white border border-gray-200 rounded-lg text-sm">
              <option>All Status</option>
              <option>Active</option>
              <option>Paused</option>
            </select> */}
          </div>

          {/* Grid View */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mySkills.map((skill) => (
                <SkillCardGrid
                  key={skill.id}
                  skill={skill}
                  onClick={() => onNavigate('skill-detail', skill)}
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
                  onClick={() => onNavigate('skill-detail', skill)}
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

      {/* Delete Confirmation Modal */}
      {deleteConfirm !== null && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full overflow-hidden shadow-xl animate-in fade-in zoom-in-95 duration-200" style={{ maxWidth: '400px' }}>
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
                <Trash2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Skill</h3>
              <p className="text-sm text-gray-500 mb-6">
                Are you sure you want to delete this skill? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  disabled={actionLoading === `delete-${deleteConfirm}`}
                  className="flex-1 px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteSkill(deleteConfirm)}
                  disabled={actionLoading === `delete-${deleteConfirm}`}
                  className="flex-1 flex justify-center items-center gap-2 px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-70 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: '#dc2626', color: '#ffffff' }}
                >
                  {actionLoading === `delete-${deleteConfirm}` ? (
                    <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  ) : (
                    'Delete'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const getImageSrc = (skill: any) => {
  if (skill.images && skill.images.length > 0) {
    return skill.images[0].formats?.thumbnail?.url || skill.images[0].url;
  }
  return "https://images.unsplash.com/photo-1517048676732-d65bc937f952?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFjaGluZ3xlbnwxfHx8fDE3Njc5MDQ1OTZ8MA&ixlib=rb-4.1.0&q=80&w=1080";
};

// Skill Card Grid Component
function SkillCardGrid({
  skill,
  onClick,
  onToggleStatus,
  onDelete
}: {
  skill: any;
  onClick: () => void;
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div
      className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer"
      onClick={onClick}
    >
      <div className="relative h-40">
        <img src={getImageSrc(skill)} alt={skill.title} className="w-full h-full object-cover" />
        <Badge
          className={`absolute top-3 right-3 ${skill.approval_status === 'approved'
            ? 'bg-green-100 text-green-700 border-green-200'
            : skill.approval_status === 'rejected'
              ? 'bg-red-100 text-red-700 border-red-200'
              : 'bg-yellow-100 text-yellow-700 border-yellow-200'
            }`}
        >
          {skill.approval_status === 'approved' ? 'Approved' : skill.approval_status === 'rejected' ? 'Rejected' : 'Pending'}
        </Badge>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1">{skill.title}</h3>
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">{skill.description_text}</p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-4 text-center">
          <div className="p-2 bg-gray-50 rounded-lg">
            <p className="text-sm font-bold text-gray-900">{skill.total_requests || 0}</p>
            <p className="text-xs text-gray-500">Views</p>
          </div>
          <div className="p-2 bg-gray-50 rounded-lg">
            <p className="text-sm font-bold text-gray-900">{skill.total_requests || 0}</p>
            <p className="text-xs text-gray-500">Requests</p>
          </div>
          <div className="p-2 bg-gray-50 rounded-lg">
            <p className="text-sm font-bold text-gray-900">{skill.rating_sum || 0}</p>
            <p className="text-xs text-gray-500">Rating</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 justify-end">
          {/* <Button
            onClick={() => onToggleStatus(skill.documentId)}
            variant="outline"
            className="flex-1 h-9 text-sm"
          >
            {skill.approval_status === 'approved' ? 'Active' : 'Pending'}
          </Button> */}
          {/* <Button variant="outline" className="h-9 px-3">
            <Edit2 className="w-4 h-4" />
          </Button> */}
          <Button
            variant="outline"
            className="h-9 px-3 text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              onDelete(skill.documentId);
            }}
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
  onClick,
  onToggleStatus,
  onDelete
}: {
  skill: any;
  onClick: () => void;
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div
      className="bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-md transition-all cursor-pointer"
      onClick={onClick}
    >
      <div className="flex gap-4">
        <img
          src={getImageSrc(skill)}
          alt={skill.title}
          className="w-24 h-24 lg:w-32 lg:h-32 rounded-xl object-cover flex-shrink-0"
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">{skill.title}</h3>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="text-xs">
                  {skill.category?.name || 'Uncategorized'}
                </Badge>
                <Badge
                  className={`text-xs ${skill.approval_status === 'approved'
                    ? 'bg-green-100 text-green-700 border-green-200'
                    : skill.approval_status === 'rejected'
                      ? 'bg-red-100 text-red-700 border-red-200'
                      : 'bg-yellow-100 text-yellow-700 border-yellow-200'
                    }`}
                >
                  {skill.approval_status}
                </Badge>
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-600 mb-4 line-clamp-2">{skill.description_text}</p>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{skill.total_requests || 0} views</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{skill.total_requests || 0} requests</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{skill.total_completed || 0} completed</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span>{skill.rating_sum || 0} ({skill.rating_count || 0})</span>
            </div>
          </div>

          <div className="flex gap-2">
            {/* <Button
              onClick={() => onToggleStatus(skill.documentId)}
              variant="outline"
              className="h-9 text-sm"
            >
              {skill.approval_status === 'approved' ? 'Pause' : 'Activate'}
            </Button> */}
            {/* <Button variant="outline" className="h-9 px-4 text-sm">
              <Edit2 className="w-4 h-4 mr-1" />
              Edit
            </Button> */}
            <Button
              variant="outline"
              className="h-9 px-4 text-sm text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                onDelete(skill.documentId);
              }}
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


