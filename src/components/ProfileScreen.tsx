import React, { useState, useEffect } from 'react';
import {
  Camera,
  MapPin,
  Mail,
  Calendar,
  Star,
  Edit2,
  Save,
  X,
  CheckCircle,
  Lock,
  Flag,
  Loader2,
  Briefcase,
  History,
  TrendingUp,
  Shield
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import BottomNavigation from './BottomNavigation';
import { Screen } from '../App';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserDetails, uploadUserProfileImage, changeUserPassword } from '../store/slices/AuthSlice';
import { AppDispatch, RootState } from '../store';
import { apiService } from '../services/apiService';
import { toast } from 'sonner';

interface ProfileScreenProps {
  onNavigate: (screen: Screen) => void;
}

export default function ProfileScreen({ onNavigate }: ProfileScreenProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [fetchingData, setFetchingData] = useState(true);

  const dispatch = useDispatch<AppDispatch>();
  const { user, loading: authLoading } = useSelector((state: RootState) => state.auth);
  const isAdmin = user?.role?.name?.toLowerCase() === 'admin' || user?.role?.type?.toLowerCase() === 'admin' || user?.role === 'admin';

  useEffect(() => {
    const fetchProfileData = async () => {
      if (isAdmin) {
        setFetchingData(false);
        return;
      }
      try {
        setFetchingData(true);
        const res = await apiService.getUserDashboard();
        if (res?.data) {
          setDashboardData(res.data);
        }
      } catch (err: any) {
        toast.error(err || "Failed to load profile statistics");
      } finally {
        setFetchingData(false);
      }
    };
    fetchProfileData();
  }, [isAdmin]);

  const getAvatarUrl = () => {
    if (!user?.profile_image?.url) {
      return `https://ui-avatars.com/api/?name=${user?.username || 'U'}&background=2563eb&color=fff&size=128`;
    }
    const url = user.profile_image.url;
    return url.startsWith('http') ? url : `https://loved-talent-fb87ca2a9f.strapiapp.com${url}`;
  };

  const profile = dashboardData?.profile || user;
  const stats = dashboardData?.stats || {
    offeredSkills: 0,
    sentRequests: 0,
    receivedRequests: 0,
    totalBookings: 0
  };

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && user?.id) {
      await dispatch(uploadUserProfileImage({ id: user.id, file }));
      toast.success("Profile image updated");
    }
  };

  if (fetchingData && !dashboardData) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-50 overflow-y-auto w-full mt-8">
      {/* Top Bar Spacer (Consistent with Dashboard) */}
      <div className="hidden lg:block h-20 w-full bg-white border-b border-gray-200"></div>

      <div className="min-h-full pb-20 lg:pb-8">
        {/* Header Banner - Increased height to prevent cutoff */}
        <div className="relative h-56 lg:h-72 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 overflow-hidden shadow-sm">
          <div className="absolute inset-0 bg-black/10"></div>
          {/* Decorative shapes */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl"></div>
        </div>

        {/* Profile Content - Reduced negative margin */}
        <div className="max-w-5xl w-full mx-auto px-4 lg:px-8 relative z-10 -mt-24 lg:-mt-32">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden mb-8">
            <div className="p-6 lg:p-10">
              <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center">
                {/* Avatar with Upload */}
                <div className="relative shrink-0 mx-auto lg:mx-0">
                  <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-3xl border-4 border-white shadow-lg overflow-hidden bg-white ring-1 ring-gray-100">
                    <img
                      src={getAvatarUrl()}
                      alt={profile?.username}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={authLoading}
                    className="absolute -bottom-3 -right-3 w-10 h-10 bg-[#2563eb] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#1d4ed8] transition-all border-2 border-white"
                  >
                    <Camera className="w-5 h-5" />
                  </button>
                </div>

                {/* Basic Info */}
                <div className="flex-1 text-center lg:text-left space-y-2">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                      <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">{profile?.username || 'User'}</h1>
                      <p className="text-blue-600 font-medium">@{profile?.username || 'user'}</p>
                    </div>
                    <Button
                      onClick={() => setIsEditing(!isEditing)}
                      variant={isEditing ? 'outline' : 'default'}
                      className="rounded-xl px-6 h-11"
                    >
                      {isEditing ? <><X className="w-4 h-4 mr-2" /> Cancel</> : <><Edit2 className="w-4 h-4 mr-2" /> Edit Profile</>}
                    </Button>
                  </div>
                  <p className="text-left px-2 text-gray-600 max-w-2xl text-sm lg:text-base leading-relaxed">
                    {profile?.bio || 'No bio provided. Tell the community about your expertise and what you want to learn!'}
                  </p>
                  <div className="flex flex-wrap text-left px-2 lg:justify-start gap-4 pt-2">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-blue-500" />
                      {profile?.location || 'Location not set'}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-blue-500" />
                      Joined {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'N/A'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Stats Banner */}
              {!isAdmin && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-10 pt-10 border-t border-gray-100">
                  <div className="text-center p-4 rounded-2xl bg-gray-50 border border-gray-100">
                    <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Total Exchanges</p>
                  </div>
                  <div className="text-center p-4 rounded-2xl bg-blue-50 border border-blue-100">
                    <p className="text-2xl font-bold text-blue-600">{stats.offeredSkills}</p>
                    <p className="text-xs text-blue-600/70 font-semibold uppercase tracking-wider">Skills Offered</p>
                  </div>
                  <div className="text-center p-4 rounded-2xl bg-purple-50 border border-purple-100">
                    <p className="text-2xl font-bold text-purple-600">{stats.sentRequests}</p>
                    <p className="text-xs text-purple-600/70 font-semibold uppercase tracking-wider">Requests Sent</p>
                  </div>
                  <div className="text-center p-4 rounded-2xl bg-green-50 border border-green-100">
                    <p className="text-2xl font-bold text-green-600">{stats.receivedRequests}</p>
                    <p className="text-xs text-green-600/70 font-semibold uppercase tracking-wider">Requests Recv</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Profile Tabs */}
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden min-h-[400px]">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full justify-start border-b border-gray-100 rounded-none h-auto p-0 bg-gray-50/50 flex">
                <TabsTrigger
                  value="overview"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 px-8 py-4 font-bold text-gray-500"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="settings"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 px-8 py-4 font-bold text-gray-500"
                >
                  Settings
                </TabsTrigger>
              </TabsList>

              <div className="p-6 lg:p-10">
                <TabsContent value="overview" className="mt-0">
                  {isEditing ? (
                    <EditProfileForm profileData={profile} onSave={() => setIsEditing(false)} dispatch={dispatch} userId={user?.id} loading={authLoading} />
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {!isAdmin && (
                        <div className="space-y-6">
                          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-blue-600" />
                            Activity Insights
                          </h3>
                          <div className="space-y-4">
                            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Briefcase className="w-5 h-5 text-gray-400" />
                                <span className="text-sm font-medium text-gray-700">Skills teaching</span>
                              </div>
                              <span className="font-bold text-gray-900">{stats.offeredSkills}</span>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <History className="w-5 h-5 text-gray-400" />
                                <span className="text-sm font-medium text-gray-700">Completion rate</span>
                              </div>
                              <span className="font-bold text-gray-900">100%</span>
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="space-y-6">
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                          <Mail className="w-5 h-5 text-blue-600" />
                          Contact
                        </h3>
                        <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                          <p className="text-sm text-gray-500 mb-1 font-semibold uppercase tracking-wide">Registered Email</p>
                          <p className="font-bold text-gray-900 break-all">{profile?.email}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="settings" className="mt-0">
                  <SettingsPanel dispatch={dispatch} loading={authLoading} />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </div>

      <div className="lg:hidden">
        <BottomNavigation activeScreen="profile" onNavigate={onNavigate} />
      </div>
    </div>
  );
}

function EditProfileForm({ profileData, onSave, dispatch, userId, loading }: any) {
  const [bio, setBio] = useState(profileData.bio || '');
  const [location, setLocation] = useState(profileData.location || '');

  const handleSave = async () => {
    try {
      await dispatch(updateUserDetails({ id: userId, data: { bio, location } }));
      toast.success("Profile updated successfully");
      onSave();
    } catch (err: any) {
      toast.error("Failed to update profile");
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="text-sm font-bold text-gray-700 mb-2 block">Username (Locked)</label>
          <Input value={profileData.username} disabled className="h-12 bg-gray-50 border-gray-200 text-gray-400" />
        </div>
        <div>
          <label className="text-sm font-bold text-gray-700 mb-2 block">Location</label>
          <Input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. New York, USA"
            className="h-12 focus:ring-blue-500 border-gray-200"
          />
        </div>
        <div>
          <label className="text-sm font-bold text-gray-700 mb-2 block">About Bio</label>
          <Textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell the community about yourself..."
            className="min-h-32 focus:ring-blue-500 border-gray-200"
          />
        </div>
      </div>
      <div className="flex gap-3 pt-6">
        <Button onClick={handleSave} disabled={loading} className="px-8 h-12 rounded-xl bg-blue-600 hover:bg-blue-700">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4 mr-2" /> Save Changes</>}
        </Button>
      </div>
    </div>
  );
}

function SettingsPanel({ dispatch, loading }: any) {
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  const handleChangePassword = async () => {
    if (!currentPassword || !password || !passwordConfirmation) {
      toast.error("Please fill in all password fields");
      return;
    }
    if (password !== passwordConfirmation) {
      toast.error("Passwords do not match");
      return;
    }

    const res = await dispatch(changeUserPassword({ currentPassword, password, passwordConfirmation }));
    if (changeUserPassword.fulfilled.match(res)) {
      toast.success("Password updated successfully");
      setCurrentPassword(''); setPassword(''); setPasswordConfirmation('');
      setShowPasswordChange(false);
    } else {
      toast.error("Failed to update password. Check your current password.");
    }
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-600" />
          Account Security
        </h3>
        <button
          onClick={() => setShowPasswordChange(!showPasswordChange)}
          className="w-full flex items-center justify-between p-5 bg-gray-50 rounded-2xl hover:bg-blue-50 transition-all border border-gray-100 hover:border-blue-200 group"
        >
          <div className="flex items-center gap-4">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <Lock className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
            </div>
            <div className="text-left">
              <p className="font-bold text-gray-900">Change Password</p>
              <p className="text-xs text-gray-500">Update your security credentials</p>
            </div>
          </div>
          <span className={`text-xl text-gray-300 transition-transform ${showPasswordChange ? 'rotate-90' : ''}`}>›</span>
        </button>

        {showPasswordChange && (
          <div className="mt-4 p-6 bg-white border border-blue-100 rounded-2xl space-y-4 shadow-inner">
            <Input type="password" placeholder="Current Password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="h-12" />
            <Input type="password" placeholder="New Password" value={password} onChange={e => setPassword(e.target.value)} className="h-12" />
            <Input type="password" placeholder="Confirm New Password" value={passwordConfirmation} onChange={e => setPasswordConfirmation(e.target.value)} className="h-12" />
            <Button onClick={handleChangePassword} disabled={loading} className="w-full h-12 rounded-xl bg-blue-600">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Update Password"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
