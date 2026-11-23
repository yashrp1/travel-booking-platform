'use client';

import React, { useState } from 'react';
import { Calendar as CalendarIcon, X, ChevronLeft, ChevronRight, Moon } from 'lucide-react';

interface DatePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  checkInDate: Date;
  checkOutDate: Date;
  onSelectDates: (checkIn: Date, checkOut: Date) => void;
}

export default function DatePickerModal({
  isOpen,
  onClose,
  checkInDate,
  checkOutDate,
  onSelectDates,
}: DatePickerModalProps) {
  const [tempCheckIn, setTempCheckIn] = useState<Date>(checkInDate);
  const [tempCheckOut, setTempCheckOut] = useState<Date>(checkOutDate);
  const [selectingStep, setSelectingStep] = useState<'checkIn' | 'checkOut'>('checkIn');

  if (!isOpen) return null;

  const today = new Date('2026-11-12T00:00:00.000Z');

  // Simple next 14 days calendar generation
  const days: Date[] = [];
  for (let i = 0; i < 28; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push(d);
  }

  const handleDateClick = (date: Date) => {
    if (selectingStep === 'checkIn') {
      setTempCheckIn(date);
      // Auto adjust checkout if needed
      if (date >= tempCheckOut) {
        const nextDay = new Date(date);
        nextDay.setDate(date.getDate() + 1);
        setTempCheckOut(nextDay);
      }
      setSelectingStep('checkOut');
    } else {
      if (date <= tempCheckIn) {
        setTempCheckIn(date);
        const nextDay = new Date(date);
        nextDay.setDate(date.getDate() + 1);
        setTempCheckOut(nextDay);
      } else {
        setTempCheckOut(date);
      }
    }
  };

  const calculateNights = () => {
    const diffTime = Math.abs(tempCheckOut.getTime() - tempCheckIn.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleApply = () => {
    onSelectDates(tempCheckIn, tempCheckOut);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
      <div className="relative w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-200 p-4">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-[#C25E34]" />
            <h3 className="text-base font-bold text-stone-900">
              Select Check-in &amp; Check-out Dates
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Selected Dates Summary Banner */}
        <div className="grid grid-cols-2 bg-stone-50 p-4 border-b border-stone-200 text-center">
          <div
            onClick={() => setSelectingStep('checkIn')}
            className={`cursor-pointer p-2 rounded-lg transition-colors ${
              selectingStep === 'checkIn'
                ? 'bg-orange-50 border border-[#C25E34]'
                : 'hover:bg-stone-100'
            }`}
          >
            <span className="block text-[11px] font-bold uppercase tracking-wider text-stone-400">
              CHECK-IN
            </span>
            <span className="text-base font-bold text-[#C25E34]">
              {tempCheckIn.toLocaleDateString('en-US', {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
              })}
            </span>
          </div>

          <div
            onClick={() => setSelectingStep('checkOut')}
            className={`cursor-pointer p-2 rounded-lg transition-colors ${
              selectingStep === 'checkOut'
                ? 'bg-orange-50 border border-[#C25E34]'
                : 'hover:bg-stone-100'
            }`}
          >
            <span className="block text-[11px] font-bold uppercase tracking-wider text-stone-400">
              CHECK-OUT
            </span>
            <span className="text-base font-bold text-stone-900">
              {tempCheckOut.toLocaleDateString('en-US', {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
              })}
            </span>
          </div>
        </div>

        {/* Days Grid */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-3 text-xs font-semibold text-stone-500">
            <span>Available Dates (Next 4 Weeks)</span>
            <span className="flex items-center gap-1 text-[#C25E34] font-bold">
              <Moon className="h-3.5 w-3.5" />
              {calculateNights()} {calculateNights() === 1 ? 'Night' : 'Nights'} Stay
            </span>
          </div>

          <div className="grid grid-cols-7 gap-1.5 text-center">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((w, idx) => (
              <span key={idx} className="text-[11px] font-bold text-stone-400 py-1">
                {w}
              </span>
            ))}

            {days.map((date, idx) => {
              const isCheckIn = date.toDateString() === tempCheckIn.toDateString();
              const isCheckOut = date.toDateString() === tempCheckOut.toDateString();
              const isInRange = date > tempCheckIn && date < tempCheckOut;

              let style = 'bg-white text-stone-700 hover:bg-stone-50';
              if (isCheckIn || isCheckOut) {
                style = 'bg-[#C25E34] text-white font-bold shadow-sm';
              } else if (isInRange) {
                style = 'bg-orange-50 text-[#C25E34] font-semibold';
              }

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleDateClick(date)}
                  className={`h-11 rounded-lg text-xs transition-colors flex flex-col items-center justify-center cursor-pointer ${style}`}
                >
                  <span>{date.getDate()}</span>
                  <span className="text-[9px] opacity-80">
                    {date.toLocaleDateString('en-US', { month: 'short' })}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-gray-100 p-4 bg-gray-50">
          <span className="text-xs text-gray-500">
            Selected: <strong className="text-gray-900">{calculateNights()} Nights</strong>
          </span>
          <button
            type="button"
            onClick={handleApply}
            className="btn-search-gradient rounded-full px-6 py-2.5 text-xs font-bold text-white uppercase tracking-wider cursor-pointer"
          >
            Apply Dates
          </button>
        </div>
      </div>
    </div>
  );
}
