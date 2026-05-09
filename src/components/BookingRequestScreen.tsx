import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, Clock, Sparkles, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Screen, SkillData } from '../App';
import { useSelector } from 'react-redux';
import { apiService } from '../services/apiService';
import { RootState } from '../store';

interface BookingRequestScreenProps {
  skill: SkillData;
  onNavigate: (screen: Screen) => void;
}

export default function BookingRequestScreen({ skill, onNavigate }: BookingRequestScreenProps) {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [duration, setDuration] = useState('1h');
  const [offerSkillId, setOfferSkillId] = useState(''); // Store ID instead of title
  const [message, setMessage] = useState('');

  const [mySkills, setMySkills] = useState<any[]>([]);
  const [loadingSkills, setLoadingSkills] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const fetchMySkills = async () => {
      if (!user?.id) return;
      try {
        setLoadingSkills(true);
        const res = await apiService.getMySkills(user.id);
        if (res?.data) {
          // Only show approved skills for exchange
          const approvedSkills = res.data.filter((s: any) => s.approval_status === 'approved');
          setMySkills(approvedSkills);
        }
      } catch (err) {
        console.error("Failed to fetch my skills:", err);
      } finally {
        setLoadingSkills(false);
      }
    };
    fetchMySkills();
  }, [user?.id]);

  const durations = [
    { value: '30m', label: '30 minutes' },
    { value: '1h', label: '1 hour' },
    { value: '2h', label: '2 hours' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !skill?.id || !offerSkillId || !selectedDate) return;

    try {
      setIsSubmitting(true);
      const payload = {
        message: message || "Skill exchange request",
        scheduled_date: selectedDate,
        requester: user.id,
        provider: skill.user?.id || skill.userId, // Assuming user.id or userId is available on the skill object
        offered_skill: parseInt(offerSkillId),
        requested_skill: skill.id
      };

      await apiService.createBooking(payload);
      onNavigate('success');
    } catch (err: any) {
      alert(err || "Failed to send request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white overflow-y-auto">
      {/* Header */}
      <div className="px-6 lg:px-8 xl:px-12 py-6 border-b border-gray-100">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => onNavigate('skill-detail')}
            className="mb-4 p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-900" />
          </button>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Request Exchange</h1>
          <p className="text-sm text-gray-500 mt-1">Exchange skills with {skill.user?.username || skill.provider?.name || 'Unknown User'}</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex-1 px-6 lg:px-8 xl:px-12 py-6 pb-32">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Date & Time Selection */}
          {skill.availability_slots && skill.availability_slots.length > 0 ? (
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#2563eb]" />
                Select an Available Slot
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {skill.availability_slots.map((slot, index) => {
                  const isSelected = selectedDate === slot.date && selectedTime === slot.start_time;
                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => {
                        setSelectedDate(slot.date);
                        setSelectedTime(slot.start_time);
                      }}
                      className={`p-4 rounded-2xl border-2 transition-all text-left relative overflow-hidden ${
                        isSelected
                          ? 'border-[#2563eb] bg-blue-50 ring-4 ring-blue-500/5'
                          : 'border-gray-100 bg-gray-50 hover:border-gray-200 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1 relative z-10">
                        <span className={`font-bold ${isSelected ? 'text-[#2563eb]' : 'text-gray-900'}`}>
                          {new Date(slot.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-[#2563eb]" />}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 relative z-10">
                        <Clock className="w-3.5 h-3.5" />
                        {slot.start_time.substring(0, 5)} - {slot.end_time.substring(0, 5)}
                      </div>
                      {isSelected && (
                        <div className="absolute top-0 right-0 w-16 h-16 bg-blue-100/50 rounded-full -mr-8 -mt-8"></div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="date-input" className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Select Date
                </label>
                <input
                  id="date-input"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label htmlFor="time-input" className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Select Time
                </label>
                <input
                  id="time-input"
                  type="time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent"
                  required
                />
              </div>
            </div>
          )}

          {/* Duration */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-3 block">
              Duration
            </label>
            <div className="grid grid-cols-3 gap-3">
              {durations.map((d) => (
                <button
                  key={d.value}
                  type="button"
                  onClick={() => setDuration(d.value)}
                  className={`h-12 rounded-xl border-2 transition-all ${
                    duration === d.value
                      ? 'border-[#2563eb] bg-blue-50 text-[#2563eb]'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Skill to Offer (Critical) */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#f97316]" />
              What You Offer
            </label>
            <p className="text-xs text-gray-500 mb-3">
              This is a barter exchange. Select a skill you'll teach in return.
            </p>
            <select
              value={offerSkillId}
              onChange={(e) => setOfferSkillId(e.target.value)}
              className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent"
              required
              disabled={loadingSkills}
            >
              {loadingSkills ? (
                <option>Loading your skills...</option>
              ) : (
                <>
                  <option value="">Choose a skill to trade...</option>
                  {mySkills.length > 0 ? (
                    mySkills.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.title} ({s.skill_level || 'All levels'})
                      </option>
                    ))
                  ) : (
                    <option disabled>No approved skills found. Please add and get approval first.</option>
                  )}
                </>
              )}
            </select>
          </div>

          {/* Message */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Personal Message
            </label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Introduce yourself and explain why you're interested in this skill exchange..."
              className="w-full min-h-32 px-4 py-3 bg-gray-50 border-gray-200 rounded-xl resize-none"
            />
          </div>

          {/* Summary Box */}
          {offerSkillId && selectedDate && (
            <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#f97316]" />
                Exchange Summary
              </h4>
              <div className="space-y-2 text-sm text-gray-700">
                <p>
                  <span className="font-medium">Trading:</span> {mySkills.find(s => s.id.toString() === offerSkillId.toString())?.title}
                </p>
                <p>
                  <span className="font-medium">For:</span> {skill.title}
                </p>
                <p>
                  <span className="font-medium">Date:</span>{' '}
                  {new Date(selectedDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
                {selectedTime && (
                  <p>
                    <span className="font-medium">Time:</span> {selectedTime}
                  </p>
                )}
                <p>
                  <span className="font-medium">Duration:</span>{' '}
                  {durations.find((d) => d.value === duration)?.label}
                </p>
              </div>
            </div>
          )}
        </div>
      </form>

      {/* Sticky Bottom Button */}
      <div className="fixed bottom-0 left-0 lg:left-64 right-0 bg-white border-t border-gray-200 px-6 lg:px-8 xl:px-12 py-4 shadow-lg z-40">
        <div className="max-w-2xl mx-auto">
          <Button
            onClick={handleSubmit}
            className="w-full h-12 bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-xl"
            disabled={!selectedDate || !selectedTime || !offerSkillId || isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Sending Request...
              </span>
            ) : (
              'Send Booking Request'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}