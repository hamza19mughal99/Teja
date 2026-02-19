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
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Switch } from './ui/switch';
import BottomNavigation from './BottomNavigation';
import { Screen } from '../App';

interface ProfileScreenProps {
  onNavigate: (screen: Screen) => void;
}

interface Review {
  id: string;
  author: string;
  authorAvatar: string;
  skillExchanged: string;
  rating: number;
  date: string;
  comment: string;
}

export default function ProfileScreen({ onNavigate }: ProfileScreenProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const profileData = {
    name: 'John Doe',
    username: '@johndoe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    website: 'johndoe.dev',
    joinDate: 'January 2024',
    bio: 'Passionate about technology and continuous learning. Love sharing knowledge and helping others grow their skills.',
    avatar: 'https://images.unsplash.com/photo-1672685667592-0392f458f46f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdCUyMHBvcnRyYWl0fGVufDF8fHx8MTc2Nzg2NTk5Nnww&ixlib=rb-4.1.0&q=80&w=1080',
  };

  const stats = {
    totalExchanges: 86,
    skillsOffered: 8,
    rating: 4.8,
    totalReviews: 62,
    badges: 5,
    hoursExchanged: 127,
  };

  const reviews: Review[] = [
    {
      id: '1',
      author: 'Sarah Mitchell',
      authorAvatar: 'SM',
      skillExchanged: 'Python Programming',
      rating: 5,
      date: '2 weeks ago',
      comment: 'John is an excellent teacher! Very patient and explains concepts clearly. Highly recommend!',
    },
    {
      id: '2',
      author: 'Alex Thompson',
      authorAvatar: 'AT',
      skillExchanged: 'Graphic Design',
      rating: 5,
      date: '1 month ago',
      comment: 'Great session! Learned so much about design principles. Looking forward to our next exchange.',
    },
    {
      id: '3',
      author: 'Emma Wilson',
      authorAvatar: 'EW',
      skillExchanged: 'Marketing Strategy',
      rating: 4,
      date: '1 month ago',
      comment: 'Very knowledgeable and professional. The session was insightful and practical.',
    },
  ];

  const badges = [
    { id: '1', name: 'Early Adopter', icon: '🌟', description: 'Joined in the first month' },
    { id: '2', name: 'Top Contributor', icon: '🏆', description: 'Completed 50+ exchanges' },
    { id: '3', name: 'Five Star', icon: '⭐', description: 'Maintained 4.5+ rating' },
    { id: '4', name: 'Community Leader', icon: '👑', description: 'Highly active member' },
    { id: '5', name: 'Verified Expert', icon: '✓', description: 'Skills verified by community' },
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="h-full flex flex-col bg-white overflow-y-auto">
      {/* Header Banner */}
      <div className="relative h-40 lg:h-48 bg-gradient-to-br from-[#2563eb] to-[#1d4ed8]">
        <div className="absolute inset-0 bg-black/10"></div>
      </div>

      {/* Profile Content */}
      <div className="flex-1 pb-20 lg:pb-8">
        <div className="max-w-5xl mx-auto px-6 lg:px-8 xl:px-12">
          {/* Profile Header */}
          <div className="relative -mt-20 lg:-mt-24 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-end gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-2xl border-4 border-white shadow-xl overflow-hidden bg-gray-200">
                  <img 
                    src={profileData.avatar} 
                    alt={profileData.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button className="absolute bottom-2 right-2 w-10 h-10 bg-[#2563eb] rounded-full flex items-center justify-center shadow-lg hover:bg-[#1d4ed8] transition-colors">
                  <Camera className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Info */}
              <div className="flex-1 lg:mb-4">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">{profileData.name}</h1>
                      <CheckCircle className="w-6 h-6 text-[#2563eb] fill-[#2563eb]" />
                    </div>
                    <p className="text-gray-500 mb-2">{profileData.username}</p>
                    <p className="text-gray-600 max-w-2xl">{profileData.bio}</p>
                  </div>
                  <Button
                    onClick={() => setIsEditing(!isEditing)}
                    variant={isEditing ? 'outline' : 'default'}
                    className={`h-11 px-6 whitespace-nowrap ${!isEditing && 'bg-[#2563eb] hover:bg-[#1d4ed8]'}`}
                  >
                    {isEditing ? (
                      <>
                        <X className="w-4 h-4 mr-2" />
                        Cancel
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
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
            <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 text-center">
              <p className="text-2xl font-bold text-[#2563eb]">{stats.totalExchanges}</p>
              <p className="text-xs text-gray-600 mt-1">Exchanges</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200 text-center">
              <p className="text-2xl font-bold text-purple-600">{stats.skillsOffered}</p>
              <p className="text-xs text-gray-600 mt-1">Skills</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border border-yellow-200 text-center">
              <p className="text-2xl font-bold text-orange-600">{stats.rating}</p>
              <p className="text-xs text-gray-600 mt-1">Rating</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 text-center">
              <p className="text-2xl font-bold text-green-600">{stats.totalReviews}</p>
              <p className="text-xs text-gray-600 mt-1">Reviews</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-red-50 to-rose-50 rounded-xl border border-red-200 text-center">
              <p className="text-2xl font-bold text-red-600">{stats.badges}</p>
              <p className="text-xs text-gray-600 mt-1">Badges</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl border border-cyan-200 text-center">
              <p className="text-2xl font-bold text-cyan-600">{stats.hoursExchanged}</p>
              <p className="text-xs text-gray-600 mt-1">Hours</p>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent mb-6">
              <TabsTrigger 
                value="overview" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#2563eb] data-[state=active]:bg-transparent px-6 py-3"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="reviews" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#2563eb] data-[state=active]:bg-transparent px-6 py-3"
              >
                Reviews
              </TabsTrigger>
              <TabsTrigger 
                value="badges" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#2563eb] data-[state=active]:bg-transparent px-6 py-3"
              >
                Badges
              </TabsTrigger>
              <TabsTrigger 
                value="settings" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#2563eb] data-[state=active]:bg-transparent px-6 py-3"
              >
                Settings
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {isEditing ? (
                <EditProfileForm profileData={profileData} onSave={() => setIsEditing(false)} />
              ) : (
                <div className="space-y-6">
                  {/* Contact Information */}
                  <div className="p-6 bg-gray-50 rounded-xl">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Mail className="w-5 h-5 text-[#2563eb]" />
                      Contact Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-gray-600">
                        <Mail className="w-4 h-4 flex-shrink-0" />
                        <span>{profileData.email}</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-600">
                        <Phone className="w-4 h-4 flex-shrink-0" />
                        <span>{profileData.phone}</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-600">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        <span>{profileData.location}</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-600">
                        <Globe className="w-4 h-4 flex-shrink-0" />
                        <a href={`https://${profileData.website}`} className="text-[#2563eb] hover:underline">
                          {profileData.website}
                        </a>
                      </div>
                      <div className="flex items-center gap-3 text-gray-600">
                        <Calendar className="w-4 h-4 flex-shrink-0" />
                        <span>Joined {profileData.joinDate}</span>
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="p-6 bg-gray-50 rounded-xl">
                    <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-900">Completed exchange with Sarah Mitchell</p>
                          <p className="text-xs text-gray-500">2 days ago</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <Star className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-900">Received 5-star review from Alex Thompson</p>
                          <p className="text-xs text-gray-500">5 days ago</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                          <Award className="w-4 h-4 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-900">Earned "Top Contributor" badge</p>
                          <p className="text-xs text-gray-500">1 week ago</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Reviews Tab */}
            <TabsContent value="reviews" className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">Reviews Received</h3>
                  <p className="text-sm text-gray-500">What others say about John</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {renderStars(5)}
                  </div>
                  <span className="font-semibold text-gray-900">{stats.rating}</span>
                  <span className="text-sm text-gray-500">({stats.totalReviews} reviews)</span>
                </div>
              </div>

              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="p-5 bg-gray-50 rounded-xl">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-white flex-shrink-0">
                        {review.authorAvatar}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="font-semibold text-gray-900">{review.author}</p>
                            <p className="text-sm text-gray-500">Learned: {review.skillExchanged}</p>
                          </div>
                          <span className="text-xs text-gray-500">{review.date}</span>
                        </div>
                        <div className="flex gap-0.5 mb-2">
                          {renderStars(review.rating)}
                        </div>
                        <p className="text-sm text-gray-700">{review.comment}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Badges Tab */}
            <TabsContent value="badges">
              <div className="mb-4">
                <h3 className="font-semibold text-gray-900">Achievements & Badges</h3>
                <p className="text-sm text-gray-500">Recognition for your contributions</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {badges.map((badge) => (
                  <div key={badge.id} className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 text-center hover:shadow-md transition-shadow">
                    <div className="text-5xl mb-3">{badge.icon}</div>
                    <h4 className="font-semibold text-gray-900 mb-1">{badge.name}</h4>
                    <p className="text-xs text-gray-600">{badge.description}</p>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings">
              <SettingsPanel />
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
function EditProfileForm({ profileData, onSave }: { profileData: any; onSave: () => void }) {
  return (
    <div className="space-y-6">
      <div className="p-6 bg-gray-50 rounded-xl">
        <h3 className="font-semibold text-gray-900 mb-4">Edit Profile Information</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Full Name</label>
            <Input defaultValue={profileData.name} className="h-11" />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Bio</label>
            <Textarea defaultValue={profileData.bio} className="min-h-24 resize-none" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Email</label>
              <Input defaultValue={profileData.email} className="h-11" />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Phone</label>
              <Input defaultValue={profileData.phone} className="h-11" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Location</label>
              <Input defaultValue={profileData.location} className="h-11" />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Website</label>
              <Input defaultValue={profileData.website} className="h-11" />
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <Button variant="outline" className="flex-1 h-11">
            Cancel
          </Button>
          <Button onClick={onSave} className="flex-1 h-11 bg-[#2563eb] hover:bg-[#1d4ed8]">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}

// Settings Panel Component
function SettingsPanel() {
  return (
    <div className="space-y-6">
      {/* Notifications */}
      <div className="p-6 bg-gray-50 rounded-xl">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5 text-[#2563eb]" />
          Notifications
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Exchange Requests</p>
              <p className="text-sm text-gray-500">Get notified when someone requests a skill exchange</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">New Messages</p>
              <p className="text-sm text-gray-500">Receive notifications for new messages</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Reviews</p>
              <p className="text-sm text-gray-500">Get notified when someone reviews you</p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </div>

      {/* Privacy */}
      <div className="p-6 bg-gray-50 rounded-xl">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-[#2563eb]" />
          Privacy & Security
        </h3>
        <div className="space-y-3">
          <button className="w-full flex items-center justify-between p-3 bg-white rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-900">Change Password</span>
            </div>
            <span className="text-gray-400">›</span>
          </button>
          <button className="w-full flex items-center justify-between p-3 bg-white rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-900">Two-Factor Authentication</span>
            </div>
            <span className="text-gray-400">›</span>
          </button>
          <button className="w-full flex items-center justify-between p-3 bg-white rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center gap-3">
              <Eye className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-900">Profile Visibility</span>
            </div>
            <span className="text-gray-400">›</span>
          </button>
        </div>
      </div>

      {/* Account */}
      <div className="p-6 bg-gray-50 rounded-xl">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5 text-[#2563eb]" />
          Account
        </h3>
        <div className="space-y-3">
          <button className="w-full flex items-center justify-between p-3 bg-white rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-900">Payment Methods</span>
            </div>
            <span className="text-gray-400">›</span>
          </button>
          <button className="w-full flex items-center justify-between p-3 bg-white rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center gap-3">
              <HelpCircle className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-900">Help & Support</span>
            </div>
            <span className="text-gray-400">›</span>
          </button>
          <button className="w-full flex items-center justify-between p-3 bg-white rounded-lg hover:bg-red-50 transition-colors text-red-600">
            <div className="flex items-center gap-3">
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Log Out</span>
            </div>
            <span className="text-red-400">›</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function Eye({ className }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>
  );
}
