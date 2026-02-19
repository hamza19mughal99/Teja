import React, { useState } from 'react';
import { ArrowLeft, Calendar, Clock, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Screen, SkillData } from '../App';

interface BookingRequestScreenProps {
  skill: SkillData;
  onNavigate: (screen: Screen) => void;
}

export default function BookingRequestScreen({ skill, onNavigate }: BookingRequestScreenProps) {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [duration, setDuration] = useState('1h');
  const [offerSkill, setOfferSkill] = useState('');
  const [message, setMessage] = useState('');

  const mySkills = [
    { id: '1', name: 'Python Programming', credits: 2 },
    { id: '2', name: 'Graphic Design', credits: 1.5 },
    { id: '3', name: 'Content Writing', credits: 1 },
    { id: '4', name: 'Marketing Strategy', credits: 2 },
  ];

  const durations = [
    { value: '30m', label: '30 minutes' },
    { value: '1h', label: '1 hour' },
    { value: '2h', label: '2 hours' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate('success');
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
          <p className="text-sm text-gray-500 mt-1">Exchange skills with {skill.provider.name}</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex-1 px-6 lg:px-8 xl:px-12 py-6 pb-32">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Date & Time */}
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
              value={offerSkill}
              onChange={(e) => setOfferSkill(e.target.value)}
              className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900"
              required
            >
              <option value="">Choose a skill to trade...</option>
              {mySkills.map((skill) => (
                <option key={skill.id} value={skill.name}>
                  {skill.name} ({skill.credits} hrs)
                </option>
              ))}
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
          {offerSkill && selectedDate && (
            <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#f97316]" />
                Exchange Summary
              </h4>
              <div className="space-y-2 text-sm text-gray-700">
                <p>
                  <span className="font-medium">Trading:</span> {offerSkill}
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
            disabled={!selectedDate || !selectedTime || !offerSkill}
          >
            Send Booking Request
          </Button>
        </div>
      </div>
    </div>
  );
}