import React, { useState } from 'react';
import { Search, Send, Paperclip, MoreVertical, Phone, Video, Info, ArrowLeft, CheckCheck, Check } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import BottomNavigation from './BottomNavigation';
import { Screen } from '../App';

interface MessagesScreenProps {
  onNavigate: (screen: Screen) => void;
}

interface Conversation {
  id: string;
  participant: {
    name: string;
    avatar: string;
    online: boolean;
  };
  lastMessage: {
    text: string;
    timestamp: string;
    unread: boolean;
    sent: boolean;
  };
  skill: string;
}

interface Message {
  id: string;
  text: string;
  sender: 'me' | 'them';
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
}

export default function MessagesScreen({ onNavigate }: MessagesScreenProps) {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [messageInput, setMessageInput] = useState('');

  const conversations: Conversation[] = [
    {
      id: '1',
      participant: {
        name: 'Sarah Mitchell',
        avatar: 'SM',
        online: true,
      },
      lastMessage: {
        text: 'Sounds great! Looking forward to our Python session tomorrow.',
        timestamp: '2m ago',
        unread: true,
        sent: false,
      },
      skill: 'Python Programming',
    },
    {
      id: '2',
      participant: {
        name: 'James Chen',
        avatar: 'JC',
        online: false,
      },
      lastMessage: {
        text: 'Thanks for the guitar lesson! Really helpful.',
        timestamp: '1h ago',
        unread: false,
        sent: true,
      },
      skill: 'Guitar Lessons',
    },
    {
      id: '3',
      participant: {
        name: 'Emma Wilson',
        avatar: 'EW',
        online: true,
      },
      lastMessage: {
        text: 'Can we reschedule to Wednesday?',
        timestamp: '3h ago',
        unread: true,
        sent: false,
      },
      skill: 'Photography',
    },
    {
      id: '4',
      participant: {
        name: 'Alex Thompson',
        avatar: 'AT',
        online: false,
      },
      lastMessage: {
        text: 'Perfect, see you then!',
        timestamp: '1d ago',
        unread: false,
        sent: true,
      },
      skill: 'Web Design',
    },
    {
      id: '5',
      participant: {
        name: 'Maria Garcia',
        avatar: 'MG',
        online: true,
      },
      lastMessage: {
        text: 'I have a question about the last session...',
        timestamp: '2d ago',
        unread: false,
        sent: false,
      },
      skill: 'Spanish Tutoring',
    },
  ];

  const messages: { [key: string]: Message[] } = {
    '1': [
      {
        id: '1',
        text: 'Hi John! I\'m excited about learning Python from you.',
        sender: 'them',
        timestamp: '10:30 AM',
        status: 'read',
      },
      {
        id: '2',
        text: 'Hello Sarah! Great to hear. I\'ve prepared some materials for you.',
        sender: 'me',
        timestamp: '10:32 AM',
        status: 'read',
      },
      {
        id: '3',
        text: 'That\'s wonderful! What time works best for you tomorrow?',
        sender: 'them',
        timestamp: '10:35 AM',
        status: 'read',
      },
      {
        id: '4',
        text: 'How about 2 PM? We can start with basics and move to data structures.',
        sender: 'me',
        timestamp: '10:37 AM',
        status: 'read',
      },
      {
        id: '5',
        text: 'Sounds great! Looking forward to our Python session tomorrow.',
        sender: 'them',
        timestamp: '10:38 AM',
        status: 'delivered',
      },
    ],
  };

  const selectedConv = conversations.find(c => c.id === selectedConversation);
  const currentMessages = selectedConversation ? messages[selectedConversation] || [] : [];

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      // Handle send message logic
      setMessageInput('');
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.skill.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex bg-white">
      {/* Conversations List - Left Sidebar */}
      <div className={`${
        selectedConversation ? 'hidden lg:flex' : 'flex'
      } flex-col w-full lg:w-96 border-r border-gray-200`}>
        {/* Header */}
        <div className="px-6 py-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-10 pr-4 bg-gray-50 border-gray-200 rounded-xl"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setSelectedConversation(conv.id)}
              className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors border-b border-gray-100 ${
                selectedConversation === conv.id ? 'bg-blue-50' : ''
              }`}
            >
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white">
                  {conv.participant.avatar}
                </div>
                {conv.participant.online && (
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></span>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-semibold text-gray-900 truncate">{conv.participant.name}</p>
                  <span className="text-xs text-gray-500 flex-shrink-0 ml-2">{conv.lastMessage.timestamp}</span>
                </div>
                <p className="text-xs text-[#2563eb] mb-1">{conv.skill}</p>
                <div className="flex items-center justify-between">
                  <p className={`text-sm truncate flex-1 ${
                    conv.lastMessage.unread ? 'text-gray-900 font-medium' : 'text-gray-500'
                  }`}>
                    {conv.lastMessage.text}
                  </p>
                  {conv.lastMessage.unread && (
                    <Badge className="ml-2 bg-[#2563eb] text-white text-xs px-2 py-0.5">
                      New
                    </Badge>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area - Right Side */}
      {selectedConversation && selectedConv ? (
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-white">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedConversation(null)}
                className="lg:hidden p-2 -ml-2 hover:bg-gray-100 rounded-full"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white">
                  {selectedConv.participant.avatar}
                </div>
                {selectedConv.participant.online && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                )}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{selectedConv.participant.name}</p>
                <p className="text-xs text-gray-500">
                  {selectedConv.participant.online ? 'Online' : 'Offline'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Phone className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Video className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Info className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Exchange Info Banner */}
          <div className="px-6 py-3 bg-blue-50 border-b border-blue-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#2563eb] rounded-full"></div>
              <p className="text-sm text-gray-700">
                <span className="font-medium">Exchange:</span> {selectedConv.skill}
              </p>
            </div>
            <button className="text-sm text-[#2563eb] hover:underline">View Details</button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 bg-gray-50">
            {currentMessages.map((message, index) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] ${
                    message.sender === 'me'
                      ? 'bg-[#2563eb] text-white rounded-2xl rounded-tr-sm'
                      : 'bg-white text-gray-900 rounded-2xl rounded-tl-sm'
                  } px-4 py-3 shadow-sm`}
                >
                  <p className="text-sm">{message.text}</p>
                  <div className={`flex items-center gap-1 mt-1 ${
                    message.sender === 'me' ? 'justify-end' : 'justify-start'
                  }`}>
                    <span className={`text-xs ${
                      message.sender === 'me' ? 'text-blue-200' : 'text-gray-500'
                    }`}>
                      {message.timestamp}
                    </span>
                    {message.sender === 'me' && (
                      <span className="text-blue-200">
                        {message.status === 'read' ? (
                          <CheckCheck className="w-4 h-4" />
                        ) : message.status === 'delivered' ? (
                          <CheckCheck className="w-4 h-4" />
                        ) : (
                          <Check className="w-4 h-4" />
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Date Divider */}
            <div className="flex items-center justify-center my-6">
              <div className="px-4 py-1 bg-white border border-gray-200 rounded-full">
                <span className="text-xs text-gray-500">Today</span>
              </div>
            </div>
          </div>

          {/* Message Input */}
          <div className="px-6 py-4 border-t border-gray-200 bg-white">
            <div className="flex items-end gap-3">
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0">
                <Paperclip className="w-5 h-5 text-gray-600" />
              </button>
              <div className="flex-1 relative">
                <Input
                  type="text"
                  placeholder="Type a message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="w-full h-11 px-4 pr-12 bg-gray-50 border-gray-200 rounded-xl"
                />
              </div>
              <Button
                onClick={handleSendMessage}
                disabled={!messageInput.trim()}
                className="h-11 px-6 bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-xl flex-shrink-0"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        // Empty State - Desktop
        <div className="hidden lg:flex flex-1 items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
              <Send className="w-12 h-12 text-[#2563eb]" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Conversation Selected</h3>
            <p className="text-gray-500">Choose a conversation from the list to start messaging</p>
          </div>
        </div>
      )}

      {/* Bottom Navigation - Mobile Only */}
      {!selectedConversation && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0">
          <BottomNavigation activeScreen="messages" onNavigate={onNavigate} />
        </div>
      )}
    </div>
  );
}
