import React, { useState } from 'react';
import {
  Camera,
  MapPin,
  Mail,
  Phone,
  Globe,
  Calendar,
  Award,
  Star,
  Edit2,
  Save,
  X,
  CheckCircle,
  Settings,
  Bell,
  Lock,
  HelpCircle,
  LogOut,
  Shield,
  CreditCard
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Switch } from './ui/switch';
import BottomNavigation from './BottomNavigation';
import { Screen } from '../App';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserDetails, uploadUserProfileImage, changeUserPassword } from '../store/slices/AuthSlice';
import { AppDispatch, RootState } from '../store';

interface ProfileScreenProps {
  onNavigate: (screen: Screen) => void;
}

export default function ProfileScreen({ onNavigate }: ProfileScreenProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const dispatch = useDispatch<AppDispatch>();
  const { user, loading } = useSelector((state: RootState) => state.auth);

  const getAvatarUrl = () => {
    if (!user?.profile_image?.url) {
      return `https://ui-avatars.com/api/?name=${user?.username || 'U'}&background=2563eb&color=fff`;
    }
    const url = user.profile_image.url;
    return url.startsWith('http') ? url : `https://loved-talent-fb87ca2a9f.strapiapp.com${url}`;
  };

  const profileData = {
    name: user?.username || 'User',
    username: `@${user?.username || 'user'}`,
    email: user?.email || '',
    phone: '',
    location: user?.location || 'Not set',
    website: '',
    joinDate: user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '',
    bio: user?.bio || '',
    avatar: getAvatarUrl(),
  };

  const reviewsAsReviewee = user?.reviews_as_reviewed_user || [];

  const stats = {
    totalExchanges: user?.skill_availabilities?.length || 0,
    skillsOffered: user?.skill_availabilities?.length || 0,
    rating: reviewsAsReviewee.length ? (reviewsAsReviewee.reduce((acc: number, curr: any) => acc + curr.rating, 0) / reviewsAsReviewee.length).toFixed(1) : 0,
    totalReviews: reviewsAsReviewee.length,
    badges: 0,
    hoursExchanged: 0,
  };

  const reviews = reviewsAsReviewee.map((r: any) => ({
    id: r.id.toString(),
    author: 'User',
    authorAvatar: 'U',
    skillExchanged: r.booking?.message || 'Skill Exchange',
    rating: r.rating,
    date: new Date(r.createdAt).toLocaleDateString(),
    comment: r.comment,
  }));

  const badges = [
    { id: '1', name: 'Early Adopter', icon: '🌟', description: 'Joined in the first month' },
    { id: '2', name: 'Top Contributor', icon: '🏆', description: 'Completed 50+ exchanges' }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
          }`}
      />
    ));
  };

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && user?.id) {
      await dispatch(uploadUserProfileImage({ id: user.id, file }));
    }
  };

  return (
    <div className="h-full bg-gray-50 overflow-y-auto w-full mt-2">
      <div className="min-h-full pb-20 lg:pb-8">
        {/* Header Banner */}
        <div className="relative h-48 lg:h-64 bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] overflow-hidden shadow-sm">
          <div className="absolute inset-0 bg-black/10"></div>
        </div>

        {/* Profile Content */}
        <div className="max-w-6xl w-full mx-auto px-4 lg:px-8  relative z-10 mb-8">
          {/* Profile Header */}
          <div className="flex flex-col lg:flex-row lg:items-end gap-6 mb-8">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-3xl border-4 border-white shadow-xl overflow-hidden bg-white">
                <img
                  src={profileData.avatar}
                  alt={profileData.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  crossOrigin="anonymous"
                />
              </div>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
              <button
                style={{
                  top: "130px",
                  right: "0",
                  border: "2px solid #fff",
                  backgroundColor: "cornflowerblue",
                  cursor: "pointer",
                }}
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
                className="absolute -bottom-5 -right-5 w-12 h-12 bg-[#2563eb] rounded-full flex items-center justify-center shadow-lg hover:bg-[#1d4ed8] transition-all z-20"
              >
                <Camera className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Info */}
            <div className="flex-1 lg:mb-4">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="w-full bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-sm border border-gray-100 lg:bg-transparent lg:shadow-none lg:border-none lg:p-0 lg:backdrop-blur-none">
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 drop-shadow-sm lg:drop-shadow-none">{profileData.name}</h1>
                  </div>
                  <p className="text-gray-500 mb-2 font-medium">{profileData.username}</p>
                  <p className="text-gray-700 max-w-2xl leading-relaxed">{profileData.bio || 'No bio available'}</p>
                </div>
                <Button
                  onClick={() => setIsEditing(!isEditing)}
                  variant={isEditing ? 'outline' : 'default'}
                  className={`h-11 px-6 whitespace-nowrap rounded-xl shadow-sm ${!isEditing && 'bg-[#2563eb] hover:bg-[#1d4ed8]'}`}
                >
                  {isEditing ? (
                    <>
                      <X className="w-4 h-4 mr-2" />
                      Cancel Editing
                    </>
                  ) : (
                    <>
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit Profile
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
            <div className="p-5 bg-white rounded-2xl border border-blue-100 shadow-sm text-center relative overflow-hidden group hover:border-blue-200 transition-colors">
              <div className="absolute inset-0 bg-blue-50/50 group-hover:bg-blue-50 transition-colors"></div>
              <div className="relative z-10">
                <p className="text-2xl font-bold text-[#2563eb]">{stats.totalExchanges}</p>
                <p className="text-xs font-medium text-blue-600/70 mt-1 uppercase tracking-wider">Exchanges</p>
              </div>
            </div>
            <div className="p-5 bg-white rounded-2xl border border-purple-100 shadow-sm text-center relative overflow-hidden group hover:border-purple-200 transition-colors">
              <div className="absolute inset-0 bg-purple-50/50 group-hover:bg-purple-50 transition-colors"></div>
              <div className="relative z-10">
                <p className="text-2xl font-bold text-purple-600">{stats.skillsOffered}</p>
                <p className="text-xs font-medium text-purple-600/70 mt-1 uppercase tracking-wider">Skills</p>
              </div>
            </div>
            <div className="p-5 bg-white rounded-2xl border border-yellow-100 shadow-sm text-center relative overflow-hidden group hover:border-yellow-200 transition-colors">
              <div className="absolute inset-0 bg-yellow-50/50 group-hover:bg-yellow-50 transition-colors"></div>
              <div className="relative z-10">
                <p className="text-2xl font-bold text-yellow-600">{stats.rating}</p>
                <p className="text-xs font-medium text-yellow-600/70 mt-1 uppercase tracking-wider">Rating</p>
              </div>
            </div>
            <div className="p-5 bg-white rounded-2xl border border-green-100 shadow-sm text-center relative overflow-hidden group hover:border-green-200 transition-colors">
              <div className="absolute inset-0 bg-green-50/50 group-hover:bg-green-50 transition-colors"></div>
              <div className="relative z-10">
                <p className="text-2xl font-bold text-green-600">{stats.totalReviews}</p>
                <p className="text-xs font-medium text-green-600/70 mt-1 uppercase tracking-wider">Reviews</p>
              </div>
            </div>
            <div className="p-5 bg-white rounded-2xl border border-red-100 shadow-sm text-center relative overflow-hidden group hover:border-red-200 transition-colors">
              <div className="absolute inset-0 bg-red-50/50 group-hover:bg-red-50 transition-colors"></div>
              <div className="relative z-10">
                <p className="text-2xl font-bold text-red-600">{stats.badges}</p>
                <p className="text-xs font-medium text-red-600/70 mt-1 uppercase tracking-wider">Badges</p>
              </div>
            </div>
            <div className="p-5 bg-white rounded-2xl border border-cyan-100 shadow-sm text-center relative overflow-hidden group hover:border-cyan-200 transition-colors">
              <div className="absolute inset-0 bg-cyan-50/50 group-hover:bg-cyan-50 transition-colors"></div>
              <div className="relative z-10">
                <p className="text-2xl font-bold text-cyan-600">{stats.hoursExchanged}</p>
                <p className="text-xs font-medium text-cyan-600/70 mt-1 uppercase tracking-wider">Hours</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full justify-start border-b border-gray-200 rounded-none h-auto p-0 bg-transparent mb-8 flex overflow-x-auto no-scrollbar">
              <TabsTrigger
                value="overview"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#2563eb] data-[state=active]:text-[#2563eb] font-medium text-gray-500 data-[state=active]:bg-transparent px-6 py-4 transition-colors shrink-0"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#2563eb] data-[state=active]:text-[#2563eb] font-medium text-gray-500 data-[state=active]:bg-transparent px-6 py-4 transition-colors shrink-0"
              >
                Reviews
              </TabsTrigger>
              <TabsTrigger
                value="badges"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#2563eb] data-[state=active]:text-[#2563eb] font-medium text-gray-500 data-[state=active]:bg-transparent px-6 py-4 transition-colors shrink-0"
              >
                Badges
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#2563eb] data-[state=active]:text-[#2563eb] font-medium text-gray-500 data-[state=active]:bg-transparent px-6 py-4 transition-colors shrink-0"
              >
                Settings
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6 focus:outline-none focus:ring-0">
              {isEditing ? (
                <EditProfileForm profileData={profileData} onSave={() => setIsEditing(false)} dispatch={dispatch} userId={user?.id} loading={loading} />
              ) : (
                <div className="space-y-6">
                  <div className="p-8 bg-white shadow-sm border border-gray-100 rounded-2xl">
                    <h3 className="font-semibold text-gray-900 mb-6 flex items-center gap-2 text-lg">
                      <Mail className="w-5 h-5 text-[#2563eb]" />
                      Contact Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-center gap-4 text-gray-600 bg-gray-50 p-4 rounded-xl">
                        <Mail className="w-5 h-5 text-[#2563eb]" />
                        <span className="font-medium">{profileData.email}</span>
                      </div>
                      <div className="flex items-center gap-4 text-gray-600 bg-gray-50 p-4 rounded-xl">
                        <MapPin className="w-5 h-5 text-[#2563eb]" />
                        <span className="font-medium">{profileData.location}</span>
                      </div>
                      <div className="flex items-center gap-4 text-gray-600 bg-gray-50 p-4 rounded-xl">
                        <Calendar className="w-5 h-5 text-[#2563eb]" />
                        <span className="font-medium">Joined {profileData.joinDate}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Reviews Tab */}
            <TabsContent value="reviews" className="space-y-6 focus:outline-none focus:ring-0">
              <div className="flex items-center justify-between p-6 bg-white border border-gray-100 rounded-2xl shadow-sm">
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">Reviews Received</h3>
                  <p className="text-sm text-gray-500 mt-1">What others say about {profileData.name.split(' ')[0]}</p>
                </div>
                <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                  <div className="flex">
                    {renderStars(5)}
                  </div>
                  <span className="font-bold text-gray-900 text-lg">{stats.rating}</span>
                  <span className="text-sm text-gray-500 font-medium">({stats.totalReviews})</span>
                </div>
              </div>

              <div className="space-y-4">
                {reviews.length > 0 ? reviews.map((review: any) => (
                  <div key={review.id} className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-5">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-lg font-bold flex-shrink-0 shadow-sm border-2 border-white ring-2 ring-gray-100">
                        {review.authorAvatar}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="font-bold text-gray-900">{review.author}</p>
                            <p className="text-sm text-[#2563eb] font-medium">{review.skillExchanged}</p>
                          </div>
                          <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">{review.date}</span>
                        </div>
                        <div className="flex gap-1 mb-3">
                          {renderStars(review.rating)}
                        </div>
                        <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl rounded-tl-none">{review.comment}</p>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-12 bg-white border border-gray-100 rounded-2xl">
                    <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">No reviews yet.</p>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Badges Tab */}
            <TabsContent value="badges" className="focus:outline-none focus:ring-0">
              <div className="mb-6 p-6 bg-white border border-gray-100 rounded-2xl shadow-sm">
                <h3 className="font-semibold text-gray-900 text-lg">Achievements & Badges</h3>
                <p className="text-sm text-gray-500 mt-1">Recognition for your contributions</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {badges.map((badge) => (
                  <div key={badge.id} className="p-8 bg-white rounded-2xl border border-gray-100 text-center hover:shadow-lg transition-all hover:-translate-y-1">
                    <div className="text-5xl mb-4 bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-inner">{badge.icon}</div>
                    <h4 className="font-bold text-gray-900 mb-2">{badge.name}</h4>
                    <p className="text-sm text-gray-500 leading-relaxed">{badge.description}</p>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="focus:outline-none focus:ring-0">
              <SettingsPanel dispatch={dispatch} loading={loading} />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Bottom Navigation - Mobile Only */}
      <div className="lg:hidden">
        <BottomNavigation activeScreen="profile" onNavigate={onNavigate} />
      </div>
    </div>
  );
}

// Edit Profile Form Component
function EditProfileForm({ profileData, onSave, dispatch, userId, loading }: any) {
  const [bio, setBio] = useState(profileData.bio);
  const [location, setLocation] = useState(profileData.location === 'Not set' ? '' : profileData.location);

  const handleSave = async () => {
    const data = { bio, location };
    await dispatch(updateUserDetails({ id: userId, data }));
    onSave();
  };

  return (
    <div className="space-y-6">
      <div className="p-8 bg-white shadow-sm border border-gray-100 rounded-2xl">
        <h3 className="font-semibold text-gray-900 mb-6 text-xl">Edit Profile Information</h3>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">Username <span className="text-xs font-normal text-gray-400 ml-1">(Cannot be changed)</span></label>
              <Input defaultValue={profileData.name} className="h-12 bg-gray-50/80 border-gray-200 text-gray-500 hover:bg-gray-50/80 cursor-not-allowed" disabled />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">Email address <span className="text-xs font-normal text-gray-400 ml-1">(Cannot be changed)</span></label>
              <Input defaultValue={profileData.email} className="h-12 bg-gray-50/80 border-gray-200 text-gray-500 hover:bg-gray-50/80 cursor-not-allowed" disabled />
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Location</label>
            <Input value={location} onChange={(e) => setLocation(e.target.value)} className="h-12 focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 transition-all shadow-sm" placeholder="e.g. San Francisco, CA" />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Bio</label>
            <Textarea value={bio} onChange={(e) => setBio(e.target.value)} className="min-h-32 resize-y focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 transition-all p-4 text-base shadow-sm" placeholder="Tell the community about your expertise and what you'd like to learn..." />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
          <Button variant="outline" onClick={onSave} className="h-12 px-6 rounded-xl font-semibold hover:bg-gray-50 transition-colors" disabled={loading}>
            <X className="w-5 h-5 mr-1" /> Cancel
          </Button>
          <Button onClick={handleSave} className="h-12 px-8 rounded-xl font-semibold bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] hover:from-[#1d4ed8] hover:to-[#1e40af] text-white shadow-md shadow-blue-500/20 transition-all active:scale-[0.98]" disabled={loading}>
            {loading ? (
              <span className="flex items-center"><svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Saving...</span>
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

// Settings Panel Component
function SettingsPanel({ dispatch, loading }: any) {
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [pwdMsg, setPwdMsg] = useState('');

  const handleChangePassword = async () => {
    setPwdMsg('');
    if (!currentPassword || !password || !passwordConfirmation) {
      setPwdMsg("Please fill in all fields");
      return;
    }
    if (password !== passwordConfirmation) {
      setPwdMsg("New passwords do not match"); return;
    }

    const data = { currentPassword, password, passwordConfirmation };
    const res = await dispatch(changeUserPassword(data));
    if (changeUserPassword.fulfilled.match(res)) {
      setPwdMsg("Success! Password changed.");
      setCurrentPassword(''); setPassword(''); setPasswordConfirmation('');
      setTimeout(() => {
        setShowPasswordChange(false);
        setPwdMsg('');
      }, 2500);
    } else {
      setPwdMsg(typeof res.payload === 'string' ? res.payload : "Failed to change password. Ensure current password is correct.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Privacy */}
      <div className="p-8 bg-white border border-gray-100 shadow-sm rounded-2xl">
        <h3 className="font-semibold text-gray-900 mb-6 flex items-center gap-3 text-lg">
          <div className="p-2 bg-blue-50 text-[#2563eb] rounded-lg">
            <Shield className="w-5 h-5" />
          </div>
          Privacy & Security
        </h3>

        <div className="space-y-3">
          <button
            onClick={() => setShowPasswordChange(!showPasswordChange)}
            className={`w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all border ${showPasswordChange ? 'border-[#2563eb]/20 bg-blue-50/30' : 'border-gray-100'}`}
          >
            <div className="flex items-center gap-4">
              <Lock className={`w-5 h-5 ${showPasswordChange ? 'text-[#2563eb]' : 'text-gray-500'}`} />
              <span className={`font-semibold ${showPasswordChange ? 'text-[#2563eb]' : 'text-gray-900'}`}>Change Password</span>
            </div>
            <span className={`text-gray-400 font-bold transition-transform duration-300 ${showPasswordChange ? 'rotate-90 text-[#2563eb]' : ''}`}>›</span>
          </button>

          <div className={`overflow-hidden transition-all duration-300 ${showPasswordChange ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="p-6 bg-white border border-blue-100 shadow-sm rounded-xl mt-3 mb-5">
              <h4 className="font-medium text-gray-900 mb-4">Create a new secure password</h4>
              <div className="space-y-5">
                <div className="mb-2">
                  <Input type="password" placeholder="Current Password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="h-12 focus:border-[#2563eb] transition-colors" />
                </div>
                <div className="mb-2">
                  <Input type="password" placeholder="New Password" value={password} onChange={e => setPassword(e.target.value)} className="h-12 focus:border-[#2563eb] transition-colors" />
                </div>
                <div className="mb-2">
                  <Input type="password" placeholder="Confirm New Password" value={passwordConfirmation} onChange={e => setPasswordConfirmation(e.target.value)} className="h-12 focus:border-[#2563eb] transition-colors" />
                </div>
              </div>

              {pwdMsg && (
                <div className={`mt-5 p-4 rounded-xl flex items-start gap-3 ${pwdMsg.includes('Success') ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                  {pwdMsg.includes('Success') ? <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" /> : <Shield className="w-5 h-5 shrink-0 mt-0.5" />}
                  <p className="text-sm font-medium">{pwdMsg}</p>
                </div>
              )}

              <div className="mt-6">
                <Button onClick={handleChangePassword} disabled={loading} className="w-full h-12 rounded-xl font-bold bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] hover:from-[#1d4ed8] hover:to-[#1e40af] shadow-md shadow-blue-500/20 text-white transition-all active:scale-[0.98]">
                  {loading ? 'Processing...' : 'Update Password'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
