'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Hotel,
  Car,
  Calendar,
  User,
  MapPin,
  Clock,
  ArrowRightLeft,
  Search,
  Sparkles,
  ShieldCheck,
  CheckCircle,
  History,
} from 'lucide-react';
import { Destination } from '@/data/mock-data';
import CityPickerModal from '@/components/home/CityPickerModal';
import DatePickerModal from '@/components/home/DatePickerModal';
import GuestsModal from '@/components/home/GuestsModal';
import { useTheme } from '@/context/ThemeContext';

interface RecentSearchItem {
  destination: string;
  checkIn: string;
  checkOut: string;
  rooms: number;
  adults: number;
}

interface HeroSearchContainerProps {
  activeCategory: 'hotels' | 'cabs';
  onCategoryChange: (cat: 'hotels' | 'cabs') => void;
}

export default function HeroSearchContainer({
  activeCategory,
  onCategoryChange,
}: HeroSearchContainerProps) {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Hotel Search State
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [checkInDate, setCheckInDate] = useState<Date>(
    () => new Date('2026-11-15T00:00:00.000Z')
  );
  const [checkOutDate, setCheckOutDate] = useState<Date>(
    () => new Date('2026-11-18T00:00:00.000Z')
  );
  const [rooms, setRooms] = useState(1);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  // Cab Search State
  const [cabTripType, setCabTripType] = useState<
    'ONE_WAY' | 'ROUND_TRIP' | 'RENTAL' | 'AIRPORT'
  >('ONE_WAY');
  const [cabFromCity, setCabFromCity] = useState('New Delhi');
  const [cabToCity, setCabToCity] = useState('Agra');
  const [cabRentalPackage, setCabRentalPackage] = useState('8 hrs / 80 kms');
  const [cabAirportTerminal, setCabAirportTerminal] = useState('Terminal 3 (T3)');
  const [cabFlightNumber, setCabFlightNumber] = useState('6E 214');
  const [cabMeetAndGreet, setCabMeetAndGreet] = useState(true);
  const [cabPickupTime, setCabPickupTime] = useState('07:00 AM');

  // Recent Searches State
  const [recentSearches, setRecentSearches] = useState<RecentSearchItem[]>([]);

  // Modal Controllers
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [isGuestsModalOpen, setIsGuestsModalOpen] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('wanderstay_recent_searches');
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      } else {
        setRecentSearches([
          { destination: 'Goa', checkIn: '2026-11-15', checkOut: '2026-11-18', rooms: 1, adults: 2 },
          { destination: 'Manali', checkIn: '2026-11-20', checkOut: '2026-11-24', rooms: 1, adults: 2 },
          { destination: 'Jaipur', checkIn: '2026-11-25', checkOut: '2026-11-28', rooms: 1, adults: 2 },
        ]);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const saveRecentSearch = (dest: string, inD: string, outD: string, r: number, a: number) => {
    try {
      const item: RecentSearchItem = { destination: dest, checkIn: inD, checkOut: outD, rooms: r, adults: a };
      const filtered = recentSearches.filter((x) => x.destination.toLowerCase() !== dest.toLowerCase());
      const updated = [item, ...filtered].slice(0, 4);
      setRecentSearches(updated);
      localStorage.setItem('wanderstay_recent_searches', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const handleSearchHotels = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const destName = selectedDestination ? selectedDestination.name : 'Goa';
    const inStr = checkInDate.toISOString().split('T')[0];
    const outStr = checkOutDate.toISOString().split('T')[0];
    saveRecentSearch(destName, inStr, outStr, rooms, adults);
    router.push(
      `/hotels/listing?destination=${encodeURIComponent(
        destName
      )}&checkIn=${inStr}&checkOut=${outStr}&rooms=${rooms}&adults=${adults}&children=${children}`
    );
  };

  const handleSearchCabs = (e: React.FormEvent) => {
    e.preventDefault();
    let url = `/cabs/listing?tripType=${cabTripType}&from=${encodeURIComponent(
      cabFromCity
    )}&to=${encodeURIComponent(
      cabTripType === 'RENTAL' ? cabRentalPackage : cabToCity
    )}&date=${checkInDate.toISOString().split('T')[0]}&time=${encodeURIComponent(
      cabPickupTime
    )}`;

    if (cabTripType === 'AIRPORT') {
      url += `&terminal=${encodeURIComponent(cabAirportTerminal)}&flight=${encodeURIComponent(
        cabFlightNumber
      )}&meetAndGreet=${cabMeetAndGreet}`;
    }

    router.push(url);
  };

  const swapCabCities = () => {
    const temp = cabFromCity;
    setCabFromCity(cabToCity);
    setCabToCity(temp);
  };

  return (
    <>
      <div className="relative w-full">
        {/* Connected Top Tabs sitting directly above the search bar (as in reference mockup) */}
        <div className="flex items-center gap-1.5 pl-4 -mb-px relative z-20">
          {/* Tab 1: Hotels & Stays */}
          <button
            type="button"
            onClick={() => onCategoryChange('hotels')}
            className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-t-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer outline-none relative ${
              activeCategory === 'hotels'
                ? isDark
                  ? 'bg-[#181126] text-white border-t border-x border-white/20 shadow-xs'
                  : 'bg-white text-[#18181B] border-t border-x border-stone-200/80 shadow-2xs after:absolute after:bottom-0 after:inset-x-4 after:h-[2.5px] after:bg-[#C25E34]'
                : isDark
                ? 'bg-white/5 hover:bg-white/10 text-stone-400'
                : 'bg-[#F2ECE4]/90 hover:bg-[#EAE2D8] text-stone-600'
            }`}
          >
            <Hotel
              className={`h-4.5 w-4.5 ${
                activeCategory === 'hotels'
                  ? isDark
                    ? 'text-[#C084FC]'
                    : 'text-[#C25E34]'
                  : 'text-stone-400'
              }`}
            />
            <span>Hotels &amp; Stays</span>
          </button>

          {/* Tab 2: Cabs */}
          <button
            type="button"
            onClick={() => onCategoryChange('cabs')}
            className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-t-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer outline-none relative ${
              activeCategory === 'cabs'
                ? isDark
                  ? 'bg-[#181126] text-white border-t border-x border-white/20 shadow-xs'
                  : 'bg-white text-[#18181B] border-t border-x border-stone-200/80 shadow-2xs after:absolute after:bottom-0 after:inset-x-4 after:h-[2.5px] after:bg-[#C25E34]'
                : isDark
                ? 'bg-white/5 hover:bg-white/10 text-stone-400'
                : 'bg-[#F2ECE4]/90 hover:bg-[#EAE2D8] text-stone-600'
            }`}
          >
            <Car
              className={`h-4.5 w-4.5 ${
                activeCategory === 'cabs'
                  ? isDark
                    ? 'text-[#C084FC]'
                    : 'text-[#C25E34]'
                  : 'text-stone-400'
              }`}
            />
            <span>Cabs</span>
          </button>
        </div>

        {/* Main Floating Search Card Container (Exact stadium/pill shape matching mockup) */}
        <div
          className={`relative z-10 rounded-2xl sm:rounded-full p-2 sm:p-2.5 transition-all shadow-[0_16px_40px_-12px_rgba(0,0,0,0.12)] ${
            isDark
              ? 'bg-[#181126] border border-white/20 text-white shadow-2xl'
              : 'bg-white border border-stone-200/80 text-stone-900'
          }`}
        >
          {activeCategory === 'hotels' ? (
            /* HOTEL 4-SEGMENT INLINE */
            <form
              onSubmit={handleSearchHotels}
              className="flex min-h-12 flex-col lg:min-h-[56px] lg:flex-row items-stretch lg:items-center justify-between gap-2 lg:gap-1 pl-1 pr-1"
            >
              {/* Segment 1: Where are you going? */}
              <div
                onClick={() => setIsCityModalOpen(true)}
                className={`flex items-center gap-3 px-3.5 sm:px-4 py-2 rounded-full cursor-pointer flex-[1.3] transition-colors ${
                  isDark ? 'hover:bg-white/5' : 'hover:bg-stone-50'
                }`}
              >
                <div
                  className={`h-9 w-9 rounded-full flex items-center justify-center shrink-0 ${
                    isDark ? 'bg-white/10 text-purple-300' : 'bg-stone-100 text-stone-700'
                  }`}
                >
                  <MapPin className="h-4.5 w-4.5" />
                </div>
                <div className="text-left overflow-hidden min-w-0">
                  <span className={`block text-xs sm:text-sm font-bold leading-tight truncate ${isDark ? 'text-white' : 'text-stone-900'}`}>
                    {selectedDestination ? selectedDestination.name : 'Where are you going?'}
                  </span>
                  <span
                    className={`block text-[11px] truncate leading-tight mt-0.5 ${
                      isDark ? 'text-stone-400' : 'text-stone-500'
                    }`}
                  >
                    {selectedDestination ? (selectedDestination.popularFor || 'India') : 'City, hotel, or area'}
                  </span>
                </div>
              </div>

              <div className={`hidden lg:block h-8 w-px ${isDark ? 'bg-white/10' : 'bg-stone-200'}`} />

              {/* Segment 2: Check-in */}
              <div
                onClick={() => setIsDateModalOpen(true)}
                className={`flex items-center gap-2.5 px-3 sm:px-3.5 py-2 rounded-full cursor-pointer shrink-0 transition-colors ${
                  isDark ? 'hover:bg-white/5' : 'hover:bg-stone-50'
                }`}
              >
                <div className={isDark ? 'text-purple-300' : 'text-stone-600'}>
                  <Calendar className="h-4.5 w-4.5" />
                </div>
                <div className="text-left">
                  <span className="block text-[10px] font-semibold uppercase text-stone-400 leading-tight">
                    Check-in
                  </span>
                  <span className={`block text-xs sm:text-sm font-bold leading-tight mt-0.5 ${isDark ? 'text-white' : 'text-stone-900'}`}>
                    {checkInDate.getDate()}{' '}
                    {checkInDate.toLocaleDateString('en-US', { month: 'short' })}
                  </span>
                </div>
              </div>

              <div className={`hidden lg:block h-8 w-px ${isDark ? 'bg-white/10' : 'bg-stone-200'}`} />

              {/* Segment 3: Check-out */}
              <div
                onClick={() => setIsDateModalOpen(true)}
                className={`flex items-center gap-2.5 px-3 sm:px-3.5 py-2 rounded-full cursor-pointer shrink-0 transition-colors ${
                  isDark ? 'hover:bg-white/5' : 'hover:bg-stone-50'
                }`}
              >
                <div className={isDark ? 'text-purple-300' : 'text-stone-600'}>
                  <Calendar className="h-4.5 w-4.5" />
                </div>
                <div className="text-left">
                  <span className="block text-[10px] font-semibold uppercase text-stone-400 leading-tight">
                    Check-out
                  </span>
                  <span className={`block text-xs sm:text-sm font-bold leading-tight mt-0.5 ${isDark ? 'text-white' : 'text-stone-900'}`}>
                    {checkOutDate.getDate()}{' '}
                    {checkOutDate.toLocaleDateString('en-US', { month: 'short' })}
                  </span>
                </div>
              </div>

              <div className={`hidden lg:block h-8 w-px ${isDark ? 'bg-white/10' : 'bg-stone-200'}`} />

              {/* Segment 4: Guests & Rooms */}
              <div
                onClick={() => setIsGuestsModalOpen(true)}
                className={`flex items-center gap-2.5 px-3 sm:px-3.5 py-2 rounded-full cursor-pointer shrink-0 transition-colors ${
                  isDark ? 'hover:bg-white/5' : 'hover:bg-stone-50'
                }`}
              >
                <div className={isDark ? 'text-purple-300' : 'text-stone-600'}>
                  <User className="h-4.5 w-4.5" />
                </div>
                <div className="text-left">
                  <span className="block text-[10px] font-semibold uppercase text-stone-400 leading-tight">
                    Guests &amp; Rooms
                  </span>
                  <span className={`block text-xs sm:text-sm font-bold leading-tight mt-0.5 ${isDark ? 'text-white' : 'text-stone-900'}`}>
                    {adults} Adults · {rooms} Room
                  </span>
                </div>
              </div>

              {/* Search Button matching the user's reference image */}
              <button
                type="submit"
                className={`flex h-11 sm:h-12 items-center justify-center gap-2 rounded-full px-6 sm:px-7 text-xs sm:text-sm font-bold text-white transition-all cursor-pointer shadow-md shrink-0 hover:scale-[1.02] active:scale-[0.98] ${
                  isDark
                    ? 'bg-gradient-to-r from-[#831843] via-[#701A75] to-[#4C1D95] hover:opacity-95'
                    : 'bg-[#C25E34] hover:bg-[#A84F2A]'
                }`}
              >
                <Search className="h-4.5 w-4.5" />
                <span>Search</span>
              </button>
            </form>
          ) : (
            /* CAB 4-SEGMENT INLINE */
            <form
              onSubmit={handleSearchCabs}
              className="flex min-h-12 flex-col lg:min-h-[56px] lg:flex-row items-stretch lg:items-center justify-between gap-2 lg:gap-1 pl-1 pr-1"
            >
              {/* Segment 1: Pickup Location */}
              <div
                className={`flex items-center gap-3 px-3.5 sm:px-4 py-2 rounded-2xl flex-1 transition-colors ${
                  isDark ? 'hover:bg-white/5' : 'hover:bg-stone-50'
                }`}
              >
                <div
                  className={`h-9 w-9 rounded-full flex items-center justify-center shrink-0 ${
                    isDark ? 'bg-white/10 text-purple-300' : 'bg-stone-100 text-stone-600'
                  }`}
                >
                  <MapPin className="h-4.5 w-4.5" />
                </div>
                <div className="text-left flex-1 min-w-0">
                  <span className="block text-[10px] uppercase font-semibold text-stone-400 leading-tight">
                    From (Pickup Location)
                  </span>
                  <input
                    type="text"
                    value={cabFromCity}
                    onChange={(e) => setCabFromCity(e.target.value)}
                    placeholder="Pickup city"
                    className={`w-full text-xs sm:text-sm font-bold bg-transparent focus:outline-none ${isDark ? 'text-white' : 'text-stone-900'}`}
                  />
                </div>
              </div>

              <div className={`hidden lg:block h-8 w-px ${isDark ? 'bg-white/10' : 'bg-stone-200'}`} />

              {/* Segment 2: Drop Location */}
              <div
                className={`flex items-center gap-3 px-3.5 sm:px-4 py-2 rounded-2xl flex-1 transition-colors relative ${
                  isDark ? 'hover:bg-white/5' : 'hover:bg-stone-50'
                }`}
              >
                <div
                  className={`h-9 w-9 rounded-full flex items-center justify-center shrink-0 ${
                    isDark ? 'bg-white/10 text-purple-300' : 'bg-stone-100 text-stone-600'
                  }`}
                >
                  <MapPin className="h-4.5 w-4.5 text-[#C25E34]" />
                </div>
                <div className="text-left flex-1 min-w-0">
                  <span className="block text-[10px] uppercase font-semibold text-stone-400 leading-tight">
                    To (Drop Location)
                  </span>
                  <input
                    type="text"
                    value={cabToCity}
                    onChange={(e) => setCabToCity(e.target.value)}
                    placeholder="Drop destination"
                    className={`w-full text-xs sm:text-sm font-bold bg-transparent focus:outline-none ${isDark ? 'text-white' : 'text-stone-900'}`}
                  />
                </div>
                <button
                  type="button"
                  onClick={swapCabCities}
                  title="Swap Cities"
                  className="p-1 rounded-full text-stone-400 hover:text-stone-700"
                >
                  <ArrowRightLeft className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className={`hidden lg:block h-8 w-px ${isDark ? 'bg-white/10' : 'bg-stone-200'}`} />

              {/* Segment 3: Departure Date */}
              <div
                onClick={() => setIsDateModalOpen(true)}
                className={`flex items-center gap-2.5 px-3 sm:px-3.5 py-2 rounded-2xl cursor-pointer shrink-0 transition-colors ${
                  isDark ? 'hover:bg-white/5' : 'hover:bg-stone-50'
                }`}
              >
                <div className={isDark ? 'text-purple-300' : 'text-stone-500'}>
                  <Calendar className="h-4.5 w-4.5" />
                </div>
                <div className="text-left">
                  <span className="block text-[10px] uppercase font-semibold text-stone-400 leading-tight">
                    Departure
                  </span>
                  <span className={`block text-xs sm:text-sm font-bold leading-tight mt-0.5 ${isDark ? 'text-white' : 'text-stone-900'}`}>
                    {checkInDate.getDate()}{' '}
                    {checkInDate.toLocaleDateString('en-US', { month: 'short' })}
                  </span>
                </div>
              </div>

              <div className={`hidden lg:block h-8 w-px ${isDark ? 'bg-white/10' : 'bg-stone-200'}`} />

              {/* Segment 4: Pickup Time */}
              <div
                className={`flex items-center gap-2.5 px-3 sm:px-3.5 py-2 rounded-2xl shrink-0 transition-colors ${
                  isDark ? 'hover:bg-white/5' : 'hover:bg-stone-50'
                }`}
              >
                <div className={isDark ? 'text-purple-300' : 'text-stone-500'}>
                  <Clock className="h-4.5 w-4.5" />
                </div>
                <div className="text-left">
                  <span className="block text-[10px] uppercase font-semibold text-stone-400 leading-tight">
                    Time
                  </span>
                  <select
                    value={cabPickupTime}
                    onChange={(e) => setCabPickupTime(e.target.value)}
                    className={`text-xs sm:text-sm font-bold bg-transparent focus:outline-none cursor-pointer ${isDark ? 'text-white' : 'text-stone-900'}`}
                  >
                    {[
                      '06:00 AM',
                      '07:00 AM',
                      '08:00 AM',
                      '09:00 AM',
                      '10:30 AM',
                      '12:00 PM',
                      '02:00 PM',
                      '04:30 PM',
                      '06:00 PM',
                      '08:00 PM',
                    ].map((time) => (
                      <option key={time} value={time} className="text-stone-900 bg-white">
                        {time}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Search Button */}
              <button
                type="submit"
                className={`flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold text-white transition-all cursor-pointer shadow-md shrink-0 ${
                  isDark
                    ? 'bg-gradient-to-r from-[#831843] via-[#701A75] to-[#4C1D95] hover:opacity-95'
                    : 'bg-[#C25E34] hover:bg-[#A84F2A]'
                }`}
              >
                <Search className="h-4 w-4" />
                <span>Search Cabs</span>
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Modals */}
      <CityPickerModal
        isOpen={isCityModalOpen}
        onClose={() => setIsCityModalOpen(false)}
        onSelect={(dest) => setSelectedDestination(dest)}
        currentCity={selectedDestination ? selectedDestination.name : ''}
      />

      <DatePickerModal
        isOpen={isDateModalOpen}
        onClose={() => setIsDateModalOpen(false)}
        checkInDate={checkInDate}
        checkOutDate={checkOutDate}
        onSelectDates={(inDate, outDate) => {
          setCheckInDate(inDate);
          setCheckOutDate(outDate);
        }}
      />

      <GuestsModal
        isOpen={isGuestsModalOpen}
        onClose={() => setIsGuestsModalOpen(false)}
        rooms={rooms}
        adults={adults}
        childrenCount={children}
        onApply={(r, a, c) => {
          setRooms(r);
          setAdults(a);
          setChildren(c);
        }}
      />
    </>
  );
}
