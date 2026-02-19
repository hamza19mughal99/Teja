import React, { useState } from 'react';
import { Bell, X, Check, Clock, MessageCircle, UserPlus, Calendar, AlertCircle, MoreVertical, ChevronLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Screen } from '../App';

interface NotificationsScreenProps {
  onNavigate: (screen: Screen) => void;
  onClose?: () => void;
}

interface Notification {
  id: string;
  type: 'request' | 'exchange' | 'message' | 'follow' | 'reminder' | 'system';
  title: string;
  message: string;
  time: string;
  read: boolean;
  avatar?: string;
  actionable?: boolean;
}

export default function NotificationsScreen({ onNavigate, onClose }: NotificationsScreenProps) {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'request',
      title: 'New Skill Request',
      message: 'Sarah Mitchell wants to learn Python Programming from you',
      time: '5 minutes ago',
      read: false,
      avatar: 'SM',
      actionable: true,
    },
    {
      id: '2',
      type: 'exchange',
      title: 'Exchange Confirmed',
      message: 'Your exchange with Alex Thompson for Web Design is confirmed for Jan 12 at 2:00 PM',
      time: '1 hour ago',
      read: false,
      actionable: false,
    },
    {
      id: '3',
      type: 'message',
      title: 'New Message',
      message: 'James Chen sent you a message about Guitar Lessons',
      time: '2 hours ago',
      read: false,
      avatar: 'JC',
      actionable: true,
    },
    {
      id: '4',
      type: 'follow',
      title: 'New Follower',
      message: 'Emma Wilson started following you',
      time: '3 hours ago',
      read: true,
      avatar: 'EW',
      actionable: false,
    },
    {
      id: '5',
      type: 'reminder',
      title: 'Upcoming Exchange',
      message: 'You have a Photography exchange with Emma Wilson tomorrow at 4:30 PM',
      time: '5 hours ago',
      read: true,
      actionable: true,
    },
    {
      id: '6',
      type: 'system',
      title: 'Profile Completed',
      message: 'Great! Your profile is 100% complete. Start exploring skills now.',
      time: '1 day ago',
      read: true,
      actionable: false,
    },
    {
      id: '7',
      type: 'request',
      title: 'Request Accepted',
      message: 'Maria Garcia accepted your request to learn Spanish Tutoring',
      time: '2 days ago',
      read: true,
      avatar: 'MG',
      actionable: false,
    },
    {
      id: '8',
      type: 'exchange',
      title: 'Exchange Completed',
      message: 'Your Cooking exchange with David Lee is complete. Leave a review!',
      time: '3 days ago',
      read: true,
      actionable: true,
    },
  ]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'request':
        return <UserPlus className="w-5 h-5" />;
      case 'exchange':
        return <Calendar className="w-5 h-5" />;
      case 'message':
        return <MessageCircle className="w-5 h-5" />;
      case 'follow':
        return <UserPlus className="w-5 h-5" />;
      case 'reminder':
        return <Clock className="w-5 h-5" />;
      case 'system':
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'request':
        return 'bg-purple-100 text-purple-600';
      case 'exchange':
        return 'bg-blue-100 text-blue-600';
      case 'message':
        return 'bg-green-100 text-green-600';
      case 'follow':
        return 'bg-pink-100 text-pink-600';
      case 'reminder':
        return 'bg-orange-100 text-orange-600';
      case 'system':
        return 'bg-gray-100 text-gray-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notif =>
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.read) 
    : notifications;

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 lg:px-8 xl:px-12 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => onClose ? onClose() : onNavigate('dashboard')}
                className="lg:hidden w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                <p className="text-sm text-gray-500 mt-1">
                  {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button
                  onClick={markAllAsRead}
                  variant="outline"
                  className="h-10 px-4 text-sm font-semibold border-gray-300 hover:bg-gray-50"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Mark all as read
                </Button>
              )}
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-xl font-semibold text-sm transition-colors ${
                filter === 'all'
                  ? 'bg-[#2563eb] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-4 py-2 rounded-xl font-semibold text-sm transition-colors ${
                filter === 'unread'
                  ? 'bg-[#2563eb] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto pb-20 lg:pb-8">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 xl:px-12 py-6">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Bell className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No notifications</h3>
              <p className="text-gray-500">
                {filter === 'unread' 
                  ? "You're all caught up! No unread notifications." 
                  : "You don't have any notifications yet."}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`bg-white rounded-2xl border transition-all hover:shadow-md group ${
                    notification.read 
                      ? 'border-gray-200' 
                      : 'border-[#2563eb]/30 shadow-sm shadow-blue-500/5'
                  }`}
                >
                  <div className="p-5">
                    <div className="flex items-start gap-4">
                      {/* Icon or Avatar */}
                      <div className="flex-shrink-0">
                        {notification.avatar ? (
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] flex items-center justify-center text-white font-semibold">
                            {notification.avatar}
                          </div>
                        ) : (
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getIconColor(notification.type)}`}>
                            {getIcon(notification.type)}
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 mb-1">
                          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                            {notification.title}
                            {!notification.read && (
                              <span className="w-2 h-2 bg-[#2563eb] rounded-full"></span>
                            )}
                          </h3>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => deleteNotification(notification.id)}
                              className="opacity-0 group-hover:opacity-100 w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-red-50 rounded-lg transition-all"
                            >
                              <X className="w-4 h-4 text-gray-500 hover:text-red-600" />
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                        <p className="text-xs text-gray-400">{notification.time}</p>

                        {/* Action Buttons */}
                        {notification.actionable && !notification.read && (
                          <div className="flex items-center gap-2 mt-4">
                            {notification.type === 'request' && (
                              <>
                                <Button
                                  onClick={() => markAsRead(notification.id)}
                                  className="h-9 px-4 bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-sm font-semibold rounded-lg"
                                >
                                  View Request
                                </Button>
                                <Button
                                  onClick={() => markAsRead(notification.id)}
                                  variant="outline"
                                  className="h-9 px-4 border-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50"
                                >
                                  Dismiss
                                </Button>
                              </>
                            )}
                            {notification.type === 'message' && (
                              <Button
                                onClick={() => {
                                  markAsRead(notification.id);
                                  onNavigate('messages');
                                }}
                                className="h-9 px-4 bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-sm font-semibold rounded-lg"
                              >
                                View Message
                              </Button>
                            )}
                            {notification.type === 'reminder' && (
                              <Button
                                onClick={() => markAsRead(notification.id)}
                                className="h-9 px-4 bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-sm font-semibold rounded-lg"
                              >
                                View Details
                              </Button>
                            )}
                            {notification.type === 'exchange' && notification.message.includes('complete') && (
                              <Button
                                onClick={() => markAsRead(notification.id)}
                                className="h-9 px-4 bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-sm font-semibold rounded-lg"
                              >
                                Leave Review
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
