'use client';

import React, { useState } from 'react';
import { Users, X, Plus, Minus, Info } from 'lucide-react';

interface GuestsModalProps {
  isOpen: boolean;
  onClose: () => void;
  rooms: number;
  adults: number;
  childrenCount: number;
  onApply: (rooms: number, adults: number, children: number) => void;
}

export default function GuestsModal({
  isOpen,
  onClose,
  rooms: initialRooms,
  adults: initialAdults,
  childrenCount: initialChildren,
  onApply,
}: GuestsModalProps) {
  const [rooms, setRooms] = useState(initialRooms);
  const [adults, setAdults] = useState(initialAdults);
  const [childrenCount, setChildrenCount] = useState(initialChildren);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-200 p-4">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-[#C25E34]" />
            <h3 className="text-base font-bold text-stone-900">
              Select Rooms &amp; Guests
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Steppers */}
        <div className="p-6 space-y-6">
          {/* Rooms */}
          <div className="flex items-center justify-between">
            <div>
              <span className="block text-sm font-bold text-[#0F172A]">Rooms</span>
              <span className="text-xs text-[#877B76]">Max 4 suites per booking</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setRooms(Math.max(1, rooms - 1))}
                disabled={rooms <= 1}
                className="h-8 w-8 rounded-full border border-[#CBD5E1] flex items-center justify-center text-[#0F172A] hover:bg-[#F8FAFC] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="w-6 text-center font-bold text-[#0F172A] text-sm">
                {rooms}
              </span>
              <button
                type="button"
                onClick={() => setRooms(Math.min(4, rooms + 1))}
                disabled={rooms >= 4}
                className="h-8 w-8 rounded-full border border-[#CBD5E1] flex items-center justify-center text-[#0F172A] hover:bg-[#F8FAFC] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <div className="h-px bg-[#E2E8F0]" />

          {/* Adults */}
          <div className="flex items-center justify-between">
            <div>
              <span className="block text-sm font-bold text-[#0F172A]">Adults</span>
              <span className="text-xs text-[#877B76]">12 years and above</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setAdults(Math.max(1, adults - 1))}
                disabled={adults <= 1}
                className="h-8 w-8 rounded-full border border-[#CBD5E1] flex items-center justify-center text-[#0F172A] hover:bg-[#F8FAFC] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="w-6 text-center font-bold text-[#0F172A] text-sm">
                {adults}
              </span>
              <button
                type="button"
                onClick={() => setAdults(Math.min(rooms * 3, adults + 1))}
                disabled={adults >= rooms * 3}
                className="h-8 w-8 rounded-full border border-[#CBD5E1] flex items-center justify-center text-[#0F172A] hover:bg-[#F8FAFC] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <div className="h-px bg-[#E2E8F0]" />

          {/* Children */}
          <div className="flex items-center justify-between">
            <div>
              <span className="block text-sm font-bold text-[#0F172A]">Children</span>
              <span className="text-xs text-[#877B76]">0 to 11 years</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setChildrenCount(Math.max(0, childrenCount - 1))}
                disabled={childrenCount <= 0}
                className="h-8 w-8 rounded-full border border-[#CBD5E1] flex items-center justify-center text-[#0F172A] hover:bg-[#F8FAFC] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="w-6 text-center font-bold text-[#0F172A] text-sm">
                {childrenCount}
              </span>
              <button
                type="button"
                onClick={() => setChildrenCount(Math.min(rooms * 2, childrenCount + 1))}
                disabled={childrenCount >= rooms * 2}
                className="h-8 w-8 rounded-full border border-[#CBD5E1] flex items-center justify-center text-[#0F172A] hover:bg-[#F8FAFC] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <div className="rounded-xl bg-orange-50 p-3.5 text-xs text-stone-700 flex items-start gap-2.5 border border-orange-200/60">
            <Info className="h-4 w-4 text-[#C25E34] shrink-0 mt-0.5" />
            <span>
              Boutique hotel policy accommodates up to 3 adults per suite. Special rollaway beds are arranged upon arrival.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-[#E2E8F0] p-4 bg-[#F8FAFC]">
          <span className="text-xs text-[#574E4A]">
            <strong>{rooms}</strong> Suite{rooms > 1 ? 's' : ''}, <strong>{adults}</strong> Guests
            {childrenCount > 0 ? `, ${childrenCount} Child` : ''}
          </span>
          <button
            type="button"
            onClick={() => {
              onApply(rooms, adults, childrenCount);
              onClose();
            }}
            className="btn-search-gradient rounded-full px-6 py-2.5 text-xs font-bold text-white uppercase tracking-wider cursor-pointer"
          >
            Apply Selection
          </button>
        </div>
      </div>
    </div>
  );
}
