'use client';

import React, { useState, useEffect } from 'react';
import { Search, MapPin, X, Building2, Flame, Loader2 } from 'lucide-react';
import { Destination } from '@/data/mock-data';
import { apiClient, DestinationResponse } from '@/lib/api-client';

interface CityPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (destination: Destination) => void;
  currentCity: string;
}

export default function CityPickerModal({
  isOpen,
  onClose,
  onSelect,
  currentCity,
}: CityPickerModalProps) {
  const [search, setSearch] = useState('');
  const [liveResults, setLiveResults] = useState<Destination[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function fetchDestinations() {
      setIsSearching(true);
      try {
        const res = await apiClient.getDestinations(search.trim());
        if (isMounted && Array.isArray(res)) {
          const mapped: Destination[] = res.map((d: DestinationResponse) => ({
            id: d.id,
            name: d.name,
            state: d.state || 'India',
            country: 'India',
            tag: d.type || 'Stay Location',
            hotelCount: d.hotelCount || 1,
            popularFor: `${d.name} verified hotels & stays`,
          }));
          setLiveResults(mapped);
        }
      } catch (err) {
        console.error('Failed to fetch destinations from database', err);
      } finally {
        if (isMounted) setIsSearching(false);
      }
    }

    if (isOpen) {
      const timer = setTimeout(fetchDestinations, search.trim() ? 250 : 0);
      return () => {
        isMounted = false;
        clearTimeout(timer);
      };
    }
  }, [search, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-fade-in">
      <div className="relative w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl border border-stone-900/20">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-200 p-4 bg-[#18181B] text-white">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#C25E34]/20 text-[#C25E34]">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight text-white">
                Select Destination, City or Landmark
              </h3>
              <p className="text-[11px] text-stone-300">
                Live database destinations from verified partner properties
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-white/70 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search Input Bar */}
        <div className="p-4 bg-stone-50 border-b border-stone-200">
          <div className="relative flex items-center">
            {isSearching ? (
              <Loader2 className="absolute left-3.5 h-4 w-4 text-[#C25E34] animate-spin" />
            ) : (
              <Search className="absolute left-3.5 h-4 w-4 text-stone-400" />
            )}
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search destination, city or landmark (e.g. Goa, Jaipur, Mumbai)"
              className="w-full rounded-xl border border-stone-300 bg-white py-2.5 pl-10 pr-4 text-sm font-semibold text-stone-900 placeholder:text-stone-400 focus:border-[#C25E34] focus:outline-none focus:ring-2 focus:ring-[#C25E34]/20 shadow-xs"
              autoFocus
            />
          </div>
        </div>

        {/* Destination List */}
        <div className="max-h-80 overflow-y-auto p-4 space-y-1">
          <div className="flex items-center justify-between px-2 py-1 text-xs font-bold uppercase tracking-wider text-stone-900">
            <div className="flex items-center gap-1.5">
              <Flame className="h-3.5 w-3.5 text-[#C25E34]" />
              <span>{search.trim() ? 'Search Results' : 'Active Destinations'}</span>
            </div>
            <span className="text-[10px] text-stone-500 font-semibold">
              {liveResults.length} Available
            </span>
          </div>

          {liveResults.length === 0 ? (
            <div className="p-8 text-center text-sm text-stone-500">
              {search.trim() ? (
                <div>
                  <p>No listed stays currently in database for &quot;{search}&quot;.</p>
                  <button
                    type="button"
                    onClick={() => {
                      onSelect({
                        id: `loc_custom_${Date.now()}`,
                        name: search.trim(),
                        state: 'India',
                        country: 'India',
                        tag: 'Search Area',
                        hotelCount: 0,
                        popularFor: 'Travel destination',
                      });
                      onClose();
                    }}
                    className="mt-3 px-4 py-2 rounded-xl bg-[#C25E34] text-white text-xs font-bold hover:bg-[#A84F2A]"
                  >
                    Select &quot;{search.trim()}&quot; anyway
                  </button>
                </div>
              ) : (
                <p>No destinations found in database. Partner properties will appear here once registered.</p>
              )}
            </div>
          ) : (
            liveResults.map((dest) => {
              const isSelected = dest.name.toLowerCase() === currentCity.toLowerCase();
              return (
                <button
                  key={dest.id || dest.name}
                  onClick={() => {
                    onSelect(dest);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between rounded-xl p-3 text-left transition-all cursor-pointer group ${
                    isSelected
                      ? 'bg-[#18181B] text-white shadow-md'
                      : 'hover:bg-stone-50 text-stone-900'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 rounded-lg p-2 transition-colors ${
                      isSelected ? 'bg-[#C25E34] text-white' : 'bg-orange-50 text-[#C25E34] border border-orange-100 group-hover:bg-orange-100'
                    }`}>
                      <MapPin className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-stone-900'}`}>
                          {dest.name}
                        </span>
                        <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-orange-50 text-[#C25E34] border border-orange-200'
                        }`}>
                          {dest.tag}
                        </span>
                      </div>
                      <p className={`text-xs mt-0.5 ${isSelected ? 'text-stone-300' : 'text-stone-500'}`}>
                        {dest.state}, {dest.country} • {dest.popularFor}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs font-bold ${isSelected ? 'text-[#C25E34]' : 'text-stone-900'}`}>
                      {dest.hotelCount}
                    </span>
                    <span className={`block text-[10px] ${isSelected ? 'text-stone-400' : 'text-stone-400'}`}>
                      Stays
                    </span>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
