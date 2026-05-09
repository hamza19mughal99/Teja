import React from 'react';
import { ArrowLeft, Star, CheckCircle, MapPin, Globe, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Screen, SkillData } from '../App';

interface SkillDetailScreenProps {
  skill: any;
  onNavigate: (screen: Screen, data?: any) => void;
}

export default function SkillDetailScreen({ skill, onNavigate }: SkillDetailScreenProps) {
  return (
    <div className="h-full flex flex-col bg-white overflow-y-auto">
      {/* Hero Image */}
      <div className="relative h-64 lg:h-96">
        <img
          src={skill.images && skill.images.length > 0
            ? skill.images[0].formats?.thumbnail?.url || skill.images[0].url
            : "https://images.unsplash.com/photo-1517048676732-d65bc937f952?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFjaGluZ3xlbnwxfHx8fDE3Njc5MDQ1OTZ8MA&ixlib=rb-4.1.0&q=80&w=1080"}
          alt={skill.title}
          className="w-full h-full object-cover"
        />
        <button
          onClick={() => onNavigate('discovery')}
          className="absolute top-6 left-6 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-900" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 pb-28 lg:pb-32">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 xl:px-12">
          {/* Header Info */}
          <div className="py-6 border-b border-gray-100">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">{skill.title}</h1>

            {/* Provider */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-xl font-bold uppercase">
                {skill.user?.username?.charAt(0) || 'U'}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-gray-900">{skill.user?.username || 'Unknown User'}</p>
                  {skill.user?.confirmed && (
                    <CheckCircle className="w-4 h-4 text-[#2563eb] fill-[#2563eb]" />
                  )}
                </div>
                {skill.user?.confirmed && (
                  <Badge variant="secondary" className="text-xs bg-blue-50 text-[#2563eb] border-blue-200 mt-1">
                    Verified Member
                  </Badge>
                )}
              </div>
            </div>

            {/* Meta Tags */}
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-purple-100 text-purple-700 border-purple-200">
                {skill.skill_level || 'All Levels'}
              </Badge>
              {skill.location && (
                <Badge className="bg-gray-100 text-gray-700 border-gray-200 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {skill.location}
                </Badge>
              )}
              {skill.category?.name && (
                <Badge className="bg-gray-100 text-gray-700 border-gray-200 flex items-center gap-1">
                  <Globe className="w-3 h-3" />
                  {skill.category.name}
                </Badge>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="py-6 border-b border-gray-100">
            <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-3">Description</h3>
            <p className="text-gray-600 leading-relaxed">{skill.description_text || skill.description || 'No description provided.'}</p>
          </div>

          {/* Availability */}
          <div className="py-6 border-b border-gray-100">
            <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-3">Availability Slots</h3>
            {skill.availability_slots && skill.availability_slots.length > 0 ? (
              <div className="space-y-3">
                {skill.availability_slots.map((slot: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-3 text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <Clock className="w-5 h-5 text-[#2563eb]" />
                    <span className="font-medium">{new Date(slot.date).toLocaleDateString()}</span>
                    <span className="text-gray-400">|</span>
                    <span>{slot.start_time.substring(0, 5)} - {slot.end_time.substring(0, 5)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No specific availability slots listed.</p>
            )}
          </div>

          {/* Reviews */}
          {/* <div className="py-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg lg:text-xl font-semibold text-gray-900">Reviews</h3>
              <div className="flex items-center gap-2">
                <div className="flex">
                  {renderStars(Math.round(skill.rating_sum || 0))}
                </div>
                <span className="font-semibold text-gray-900">{skill.rating_sum || 0}</span>
                <span className="text-sm text-gray-500">({skill.rating_count || 0})</span>
              </div>
            </div>

            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-start gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-white text-sm flex-shrink-0">
                      {review.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-semibold text-gray-900">{review.author}</p>
                        <span className="text-xs text-gray-500">{review.date}</span>
                      </div>
                      <div className="flex gap-0.5 mb-2">
                        {renderStars(review.rating)}
                      </div>
                      <p className="text-sm text-gray-600">{review.comment}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div> */}
        </div>
      </div>

      {/* Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 lg:left-64 right-0 bg-white border-t border-gray-200 px-6 lg:px-8 xl:px-12 py-4 shadow-lg z-40">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <div className="flex items-center gap-6 flex-1">
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-5 h-5" />
              <span className="font-semibold">Type: {skill.type || 'OFFER'}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold text-gray-900">{skill.rating_sum || 0}</span>
            </div>
          </div>
          <Button
            onClick={() => onNavigate('booking')}
            className="h-12 px-8 bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-xl"
          >
            Request Exchange
          </Button>
        </div>
      </div>
    </div>
  );
}