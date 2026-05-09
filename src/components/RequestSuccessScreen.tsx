import React from 'react';
import { CheckCircle2, Home, Search } from 'lucide-react';
import { Button } from './ui/button';
import { Screen, SkillData } from '../App';

interface RequestSuccessScreenProps {
  skill: SkillData;
  onNavigate: (screen: Screen) => void;
}

export default function RequestSuccessScreen({ skill, onNavigate }: RequestSuccessScreenProps) {
  return (
    <div className="h-full flex items-center justify-center bg-white px-8 py-12 overflow-y-auto">
      <div className="max-w-md w-full">
        {/* Success Animation/Icon */}
        <div className="mb-8 relative flex justify-center">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center animate-scale-in">
            <CheckCircle2 className="w-20 h-20 text-[#10b981]" strokeWidth={2} />
          </div>
          <div className="absolute inset-0 rounded-full bg-green-400/20 animate-ping"></div>
        </div>

        {/* Success Message */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Request Sent!</h1>
          <p className="text-gray-600 mb-6">
            We've notified <span className="font-semibold text-gray-900">{skill.user?.username || skill.provider?.name || 'the provider'}</span>.
            You'll hear back soon.
          </p>

          {/* Request Details */}
          <div className="p-4 bg-gray-50 rounded-xl text-left">
            <h3 className="font-semibold text-gray-900 mb-3">Request Details</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Skill Requested:</span>
                <span className="font-medium text-gray-900">{skill.title}</span>
              </div>
              <div className="flex justify-between">
                <span>Provider:</span>
                <span className="font-medium text-gray-900">{skill.user?.username || skill.provider?.name || 'Unknown'}</span>
              </div>
              <div className="flex justify-between">
                <span>Duration:</span>
                <span className="font-medium text-gray-900">{skill.credit_hours || skill.creditHours || 1} hour</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                  Pending Approval
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full space-y-3">
          <Button
            onClick={() => onNavigate('dashboard')}
            className="w-full h-12 bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-xl flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Back to Dashboard
          </Button>
          <button
            onClick={() => onNavigate('discovery')}
            className="w-full h-12 text-[#2563eb] hover:underline flex items-center justify-center gap-2"
          >
            <Search className="w-5 h-5" />
            Browse more skills
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <p className="text-xs text-gray-600 text-center">
            💡 <span className="font-medium">Tip:</span> Providers typically respond within 24 hours.
            You'll receive a notification when they accept or suggest alternative times.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes scale-in {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        .animate-scale-in {
          animation: scale-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}