'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useTheme } from '@/context/ThemeContext';
import { apiClient } from '@/lib/api-client';
import {
  Bus,
  Search,
  Calendar,
  MapPin,
  Clock,
  Star,
  CheckCircle2,
  Shield,
  Wifi,
  Zap,
  Coffee,
  Navigation,
  ArrowRight,
  ArrowLeftRight,
  User,
  Phone,
  Mail,
  X,
  CreditCard,
  Ticket,
  ChevronRight,
  SlidersHorizontal,
  Printer,
  Sparkles,
  Info,
  Check,
  Armchair,
  Bed,
} from 'lucide-react';

interface PassengerDetail {
  seatNo: string;
  name: string;
  age: string;
  gender: 'M' | 'F';
}

export default function BusesPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Search States
  const [fromCity, setFromCity] = useState('New Delhi');
  const [toCity, setToCity] = useState('Manali');
  const [travelDate, setTravelDate] = useState('2026-11-29');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    setTravelDate(today.toISOString().split('T')[0]);
  }, []);

  // Filter States
  const [busTypeFilter, setBusTypeFilter] = useState('ALL');
  const [timeFilter, setTimeFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState<'PRICE_ASC' | 'PRICE_DESC' | 'RATING' | 'DEPARTURE'>('PRICE_ASC');

  // Data States
  const [buses, setBuses] = useState<any[]>([]);
  const [popularRoutes, setPopularRoutes] = useState<any[]>([]);

  // Seat Selection & Booking State
  const [selectedBus, setSelectedBus] = useState<any | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [activeDeck, setActiveDeck] = useState<'LOWER' | 'UPPER'>('LOWER');
  const [selectedBoardingPoint, setSelectedBoardingPoint] = useState<string>('');
  const [selectedDroppingPoint, setSelectedDroppingPoint] = useState<string>('');

  // Per-seat passenger details
  const [passengers, setPassengers] = useState<PassengerDetail[]>([]);
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<any | null>(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [busData, routesData] = await Promise.all([
        apiClient.searchBuses({ fromCity, toCity, travelDate }),
        apiClient.getPopularBusRoutes(),
      ]);

      if (busData && busData.buses) {
        setBuses(busData.buses);
      }
      if (routesData) {
        setPopularRoutes(routesData);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const res = await apiClient.searchBuses({
        fromCity,
        toCity,
        travelDate,
        busType: busTypeFilter !== 'ALL' ? busTypeFilter : undefined,
      });
      if (res && res.buses) {
        setBuses(res.buses);
      }
    } catch (err) {
      console.error('Error searching buses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSwapCities = () => {
    const temp = fromCity;
    setFromCity(toCity);
    setToCity(temp);
  };

  const handleSelectRoute = (from: string, to: string) => {
    setFromCity(from);
    setToCity(to);
    setLoading(true);
    apiClient.searchBuses({ fromCity: from, toCity: to, travelDate }).then((res) => {
      if (res && res.buses) setBuses(res.buses);
      setLoading(false);
    });
  };

  const handleOpenSeatPicker = (bus: any) => {
    setSelectedBus(bus);
    setSelectedSeats([]);
    setPassengers([]);
    setSelectedBoardingPoint(bus.boardingPoints?.[0] || `${bus.fromCity} Main Hub`);
    setSelectedDroppingPoint(bus.droppingPoints?.[0] || `${bus.toCity} Central Depot`);
  };

  const toggleSeat = (seatNumber: string, isBooked: boolean) => {
    if (isBooked) return;
    if (selectedSeats.includes(seatNumber)) {
      const updated = selectedSeats.filter((s) => s !== seatNumber);
      setSelectedSeats(updated);
      setPassengers(passengers.filter((p) => p.seatNo !== seatNumber));
    } else {
      if (selectedSeats.length >= 6) {
        alert('You can reserve a maximum of 6 berths per booking.');
        return;
      }
      const updated = [...selectedSeats, seatNumber];
      setSelectedSeats(updated);
      setPassengers([
        ...passengers,
        { seatNo: seatNumber, name: '', age: '', gender: 'M' },
      ]);
    }
  };

  const updatePassengerField = (seatNo: string, field: keyof PassengerDetail, value: any) => {
    setPassengers(
      passengers.map((p) => (p.seatNo === seatNo ? { ...p, [field]: value } : p))
    );
  };

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSeats.length === 0) {
      alert('Please select at least 1 berth to proceed.');
      return;
    }
    const missingName = passengers.find((p) => !p.name.trim());
    if (missingName) {
      alert(`Please enter the passenger name for Berth ${missingName.seatNo}.`);
      return;
    }

    setBookingLoading(true);
    try {
      const totalFare = selectedSeats.length * selectedBus.fare;
      const res = await apiClient.initiateBusBooking({
        busId: selectedBus.id,
        operatorName: selectedBus.operatorName,
        busType: selectedBus.busType,
        fromCity: selectedBus.fromCity,
        toCity: selectedBus.toCity,
        travelDate,
        departureTime: selectedBus.departureTime,
        arrivalTime: selectedBus.arrivalTime,
        seatNumbers: selectedSeats,
        boardingPoint: selectedBoardingPoint,
        droppingPoint: selectedDroppingPoint,
        passengerName: passengers[0]?.name || 'Primary Passenger',
        passengerEmail: contactEmail,
        passengerPhone: contactPhone,
        passengers,
        baseAmount: totalFare,
      });

      if (res && res.bookingReference) {
        setConfirmedBooking({
          ...res,
          passengers,
          contactEmail,
          contactPhone,
        });
        setSelectedBus(null);
      }
    } catch (err: any) {
      alert('Booking failed: ' + (err.message || 'Please try again'));
    } finally {
      setBookingLoading(false);
    }
  };

  // Filter & Sort Logic
  const filteredBuses = buses
    .filter((bus) => {
      // Bus Type
      if (busTypeFilter !== 'ALL') {
        const typeLower = (bus.busType || '').toLowerCase();
        if (busTypeFilter === 'Sleeper' && !typeLower.includes('sleeper')) return false;
        if (busTypeFilter === 'Volvo' && !typeLower.includes('volvo')) return false;
        if (busTypeFilter === 'Scania' && !typeLower.includes('scania')) return false;
        if (busTypeFilter === 'BharatBenz' && !typeLower.includes('bharatbenz')) return false;
      }
      // Departure Time Filter
      if (timeFilter !== 'ALL') {
        const dep = bus.departureTime || '';
        const isPM = dep.toUpperCase().includes('PM');
        let hour = parseInt(dep.split(':')[0], 10) || 0;
        if (isPM && hour < 12) hour += 12;
        if (!isPM && hour === 12) hour = 0;

        if (timeFilter === 'MORNING' && (hour < 6 || hour >= 12)) return false;
        if (timeFilter === 'AFTERNOON' && (hour < 12 || hour >= 18)) return false;
        if (timeFilter === 'EVENING' && (hour < 18 || hour >= 23)) return false;
        if (timeFilter === 'NIGHT' && hour >= 6 && hour < 23) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'PRICE_ASC') return Number(a.fare) - Number(b.fare);
      if (sortBy === 'PRICE_DESC') return Number(b.fare) - Number(a.fare);
      if (sortBy === 'RATING') return Number(b.rating || 0) - Number(a.rating || 0);
      return 0;
    });

  return (
    <div
      className={`min-h-screen flex flex-col justify-between ${
        isDark ? 'bg-[#0F0A18] text-white' : 'bg-[#FAF8F5] text-stone-900'
      }`}
    >
      <Header activeTab={'buses' as any} onTabChange={() => {}} />

      <main className="flex-1 pb-16">
        {/* =========================================================================
            1. HERO SEARCH CONTAINER (Redesigned: Clean, Scroll-Free, ERP Parity)
           ========================================================================= */}
        <section className="relative overflow-hidden pt-8 pb-12 bg-gradient-to-b from-[#241714] via-[#1A110F] to-[#120B0A] text-white border-b border-stone-800">
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#C25E34_1px,transparent_1px)] [background-size:20px_20px]" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Tagline */}
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#C25E34] text-white flex items-center gap-1.5 shadow-md">
                <Bus className="w-3.5 h-3.5" />
                Intercity Smart Bus Network
              </span>
              <span className="text-xs text-stone-400 font-medium hidden sm:inline">
                Verified luxury sleepers &amp; express multi-axle coaches
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              Book Luxury Intercity Buses across India
            </h1>
            <p className="mt-2 text-sm text-stone-300 max-w-2xl font-normal leading-relaxed">
              Travel comfortably with Zingbus, IntrCity, VRL, and KSRTC Swift. Zero cancellation shield, live GPS tracking, and guaranteed clean berths.
            </p>

            {/* MAIN SEARCH CARD - COMPLETELY SCROLL-FREE & SPACIOUS */}
            <div className="mt-6 p-4 sm:p-5 rounded-3xl bg-white text-stone-900 shadow-2xl border border-stone-200">
              <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
                {/* FROM CITY */}
                <div className="lg:col-span-4 p-3 rounded-2xl bg-stone-50 border border-stone-200 hover:border-[#C25E34] transition-all relative">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#C25E34]" /> From City
                  </label>
                  <input
                    type="text"
                    required
                    value={fromCity}
                    onChange={(e) => setFromCity(e.target.value)}
                    placeholder="Enter origin city (e.g. New Delhi)"
                    className="w-full bg-transparent font-extrabold text-sm text-stone-900 focus:outline-none placeholder:text-stone-400"
                  />
                  {/* Swap Button on desktop */}
                  <button
                    type="button"
                    onClick={handleSwapCities}
                    title="Swap Origin and Destination"
                    className="hidden lg:flex absolute -right-3.5 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white border border-stone-300 shadow-sm items-center justify-center text-stone-600 hover:text-[#C25E34] hover:border-[#C25E34] transition-all"
                  >
                    <ArrowLeftRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* TO DESTINATION */}
                <div className="lg:col-span-4 p-3 rounded-2xl bg-stone-50 border border-stone-200 hover:border-[#C25E34] transition-all">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1 flex items-center gap-1.5">
                    <Navigation className="w-3.5 h-3.5 text-[#C25E34]" /> To Destination
                  </label>
                  <input
                    type="text"
                    required
                    value={toCity}
                    onChange={(e) => setToCity(e.target.value)}
                    placeholder="Enter destination (e.g. Manali, Goa)"
                    className="w-full bg-transparent font-extrabold text-sm text-stone-900 focus:outline-none placeholder:text-stone-400"
                  />
                </div>

                {/* JOURNEY DATE */}
                <div className="lg:col-span-2 p-3 rounded-2xl bg-stone-50 border border-stone-200 hover:border-[#C25E34] transition-all">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#C25E34]" /> Journey Date
                  </label>
                  <input
                    type="date"
                    required
                    value={travelDate}
                    onChange={(e) => setTravelDate(e.target.value)}
                    className="w-full bg-transparent font-extrabold text-xs sm:text-sm text-stone-900 focus:outline-none"
                  />
                </div>

                {/* SEARCH CTA */}
                <div className="lg:col-span-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-13 rounded-2xl bg-[#C25E34] hover:bg-[#A84A24] text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all cursor-pointer active:scale-98"
                  >
                    <Search className="w-4 h-4" />
                    <span>{loading ? 'Searching...' : 'Find Buses'}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* POPULAR CORRIDORS QUICK-CHIPS: CLEAN, WRAPPED, NO SCROLLBAR */}
            {popularRoutes.length > 0 && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 mr-1 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#C25E34]" /> Popular Corridors:
                </span>
                {popularRoutes.map((r, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectRoute(r.fromCity, r.toCity)}
                    className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-[#C25E34] text-white text-xs font-semibold backdrop-blur-xs transition-all border border-white/10 hover:border-[#C25E34] cursor-pointer flex items-center gap-1.5"
                  >
                    <span>{r.fromCity}</span>
                    <ArrowRight className="w-3 h-3 opacity-60" />
                    <span>{r.toCity}</span>
                    <span className="text-[10px] text-amber-300 font-bold ml-1">
                      ₹{r.startingFare}+
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* =========================================================================
            2. RESULTS & ERP FILTER TOOLBAR
           ========================================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          {/* Header & Controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-200 dark:border-stone-800">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black text-stone-900 dark:text-white">
                  {fromCity} ➔ {toCity}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-[#C25E34]/10 text-[#C25E34] font-bold text-xs">
                  {filteredBuses.length} Coaches
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Departures on {travelDate} • Live inventory guaranteed
              </p>
            </div>

            {/* Sort Toolbar */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-bold text-stone-500">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-1.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs font-bold focus:outline-none"
              >
                <option value="PRICE_ASC">Fare: Lowest First</option>
                <option value="PRICE_DESC">Fare: Highest First</option>
                <option value="RATING">Operator Rating (Top Rated)</option>
              </select>
            </div>
          </div>

          {/* Quick Filter Badges */}
          <div className="py-4 flex flex-wrap items-center gap-2 border-b border-stone-200/60 dark:border-stone-800/60 mb-6">
            <span className="text-xs font-bold text-stone-400 mr-1 flex items-center gap-1">
              <SlidersHorizontal className="w-3.5 h-3.5" /> Coach Filter:
            </span>
            {['ALL', 'Sleeper', 'Volvo', 'Scania', 'BharatBenz'].map((type) => (
              <button
                key={type}
                onClick={() => setBusTypeFilter(type)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  busTypeFilter === type
                    ? 'bg-[#C25E34] text-white shadow-sm'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
                }`}
              >
                {type === 'ALL' ? 'All Coach Classes' : type}
              </button>
            ))}

            <div className="h-4 w-px bg-stone-300 dark:bg-stone-700 mx-2 hidden sm:block" />

            <span className="text-xs font-bold text-stone-400 mr-1">Time:</span>
            {[
              { id: 'ALL', label: 'All Day' },
              { id: 'MORNING', label: 'Morning (6 AM - 12 PM)' },
              { id: 'AFTERNOON', label: 'Afternoon (12 PM - 6 PM)' },
              { id: 'EVENING', label: 'Evening (6 PM - 11 PM)' },
              { id: 'NIGHT', label: 'Night (11 PM - 6 AM)' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTimeFilter(t.id)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  timeFilter === t.id
                    ? 'bg-stone-900 dark:bg-white text-white dark:text-stone-900 shadow-sm'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* =========================================================================
              3. BUS LISTING CARDS (MakeMyTrip / RedBus Parity)
             ========================================================================= */}
          {filteredBuses.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-8 shadow-sm">
              <Bus className="w-14 h-14 text-stone-300 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-stone-900 dark:text-white">
                No coaches match your filters for {fromCity} ➔ {toCity}
              </h3>
              <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                Try resetting your filters or selecting one of our popular national corridors.
              </p>
              <div className="mt-4 flex justify-center gap-3">
                <button
                  onClick={() => {
                    setBusTypeFilter('ALL');
                    setTimeFilter('ALL');
                  }}
                  className="px-4 py-2 rounded-xl border border-stone-300 text-xs font-bold text-stone-700 hover:bg-stone-50 cursor-pointer"
                >
                  Reset Filters
                </button>
                <button
                  onClick={() => handleSelectRoute('New Delhi', 'Manali')}
                  className="px-5 py-2 rounded-xl bg-[#C25E34] text-white text-xs font-bold shadow-md cursor-pointer hover:bg-[#A84A24]"
                >
                  View Delhi ➔ Manali Buses
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBuses.map((bus) => (
                <div
                  key={bus.id}
                  className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200/90 dark:border-stone-800 p-5 sm:p-6 shadow-xs hover:shadow-md transition-all"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    {/* Operator Details */}
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="font-black text-lg text-stone-900 dark:text-white">
                          {bus.operatorName}
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Certified Operator
                        </span>
                        {bus.rating && (
                          <span className="flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200">
                            <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                            {bus.rating}
                            <span className="text-[10px] opacity-75">({bus.reviewCount || 480})</span>
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-stone-500 font-semibold mb-4">
                        {bus.busType} • Coach Reg: <span className="font-mono text-stone-700 dark:text-stone-300">{bus.registrationNumber || 'KA-01-AB-4029'}</span>
                      </div>

                      {/* Timeline: Departure -> Route Info -> Arrival */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-3 px-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/60 dark:border-stone-700/60">
                        <div>
                          <div className="text-xl font-black text-stone-900 dark:text-white">
                            {bus.departureTime}
                          </div>
                          <div className="text-xs font-bold text-stone-700 dark:text-stone-300">
                            {bus.fromCity}
                          </div>
                          <div className="text-[11px] text-stone-500 truncate mt-0.5">
                            {bus.boardingPoints?.[0] || 'Kashmere Gate ISBT'}
                          </div>
                        </div>

                        <div className="flex flex-col items-center justify-center text-center">
                          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                            {bus.duration}
                          </span>
                          <div className="w-full max-w-[120px] h-0.5 bg-stone-300 dark:bg-stone-600 relative my-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-[#C25E34] absolute -top-1 left-1/2 -translate-x-1/2 shadow-xs" />
                          </div>
                          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                            Express Corridor • Direct
                          </span>
                        </div>

                        <div className="sm:text-right">
                          <div className="text-xl font-black text-stone-900 dark:text-white">
                            {bus.arrivalTime}
                          </div>
                          <div className="text-xs font-bold text-stone-700 dark:text-stone-300">
                            {bus.toCity}
                          </div>
                          <div className="text-[11px] text-stone-500 truncate mt-0.5">
                            {bus.droppingPoints?.[0] || 'Central Bus Depot'}
                          </div>
                        </div>
                      </div>

                      {/* Amenities Chips */}
                      <div className="flex flex-wrap items-center gap-1.5 mt-3">
                        {bus.amenities?.map((am: string, i: number) => (
                          <span
                            key={i}
                            className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 flex items-center gap-1"
                          >
                            <Check className="w-2.5 h-2.5 text-[#C25E34]" />
                            {am}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Fare & CTA */}
                    <div className="lg:border-l lg:border-stone-200 dark:lg:border-stone-800 lg:pl-6 flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-3">
                      <div className="text-left lg:text-right">
                        <div className="text-xs text-stone-400 line-through">
                          ₹{bus.originalFare || Math.round(bus.fare * 1.25)}
                        </div>
                        <div className="text-3xl font-black text-[#C25E34]">
                          ₹{bus.fare}
                        </div>
                        <div className="text-[11px] font-extrabold text-amber-700 dark:text-amber-400 mt-0.5">
                          {bus.availableSeats} Berths Available
                        </div>
                      </div>

                      <button
                        onClick={() => handleOpenSeatPicker(bus)}
                        className="px-6 py-3 rounded-2xl bg-[#C25E34] hover:bg-[#A84A24] text-white font-black text-sm shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-1.5 active:scale-98"
                      >
                        <span>Select Berths</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* =========================================================================
            4. INTERACTIVE 2+1 BERTH PICKER & ERP PASSENGER FORM MODAL
           ========================================================================= */}
        {selectedBus && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-stone-900 rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto p-5 sm:p-7 shadow-2xl border border-stone-200 dark:border-stone-800">
              {/* Modal Header */}
              <div className="flex items-start justify-between pb-4 border-b border-stone-200 dark:border-stone-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-[#C25E34] text-white">
                      Coach Seat Matrix
                    </span>
                    <h3 className="text-lg font-black text-stone-900 dark:text-white">
                      {selectedBus.operatorName} • {selectedBus.busType}
                    </h3>
                  </div>
                  <p className="text-xs text-stone-500 mt-1">
                    {selectedBus.fromCity} ({selectedBus.departureTime}) ➔ {selectedBus.toCity} ({selectedBus.arrivalTime})
                  </p>
                </div>
                <button
                  onClick={() => setSelectedBus(null)}
                  className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Deck Tabs */}
              <div className="flex gap-2 my-4">
                <button
                  type="button"
                  onClick={() => setActiveDeck('LOWER')}
                  className={`flex-1 py-2.5 text-xs font-black rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    activeDeck === 'LOWER'
                      ? 'bg-[#C25E34] text-white shadow-md'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  <Armchair className="w-4 h-4" />
                  <span>Lower Deck (Berths L1 – L18)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveDeck('UPPER')}
                  className={`flex-1 py-2.5 text-xs font-black rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    activeDeck === 'UPPER'
                      ? 'bg-[#C25E34] text-white shadow-md'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  <Bed className="w-4 h-4" />
                  <span>Upper Panoramic Deck (Berths U1 – U18)</span>
                </button>
              </div>

              {/* Realistic 2+1 Coach Layout */}
              <div className="p-4 sm:p-6 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700 mb-6">
                {/* Driver Cabin Header */}
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-200 dark:border-stone-700 text-xs font-bold text-stone-400 uppercase tracking-widest">
                  <span>Front Entrance</span>
                  <span className="flex items-center gap-1.5 text-stone-600 dark:text-stone-300">
                    <Navigation className="w-3.5 h-3.5 text-[#C25E34]" /> Driver Cabin &amp; Steering
                  </span>
                </div>

                {/* 2+1 Layout Grid */}
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 max-w-lg mx-auto">
                  {selectedBus.seats
                    ?.filter((s: any) => s.deck === activeDeck)
                    .map((seat: any) => {
                      const isSelected = selectedSeats.includes(seat.number);
                      const isBooked = seat.isBooked;

                      return (
                        <button
                          key={seat.id}
                          type="button"
                          disabled={isBooked}
                          onClick={() => toggleSeat(seat.number, isBooked)}
                          className={`h-20 rounded-2xl flex flex-col justify-between p-2 border-2 transition-all cursor-pointer relative overflow-hidden ${
                            isBooked
                              ? 'bg-stone-200/80 dark:bg-stone-800 border-stone-300 text-stone-400 cursor-not-allowed opacity-50'
                              : isSelected
                              ? 'bg-[#C25E34] border-[#8F3512] text-white shadow-lg scale-105 font-black ring-2 ring-[#C25E34]/40'
                              : 'bg-white dark:bg-stone-900 border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white hover:border-[#C25E34] hover:shadow-xs'
                          }`}
                        >
                          {/* Pillow indicator */}
                          <div
                            className={`w-6 h-1.5 rounded-full mx-auto ${
                              isSelected ? 'bg-white/60' : 'bg-stone-300 dark:bg-stone-600'
                            }`}
                          />
                          <span className="text-xs font-black">{seat.number}</span>
                          <span className={`text-[10px] font-bold ${isSelected ? 'text-amber-200' : 'text-stone-500'}`}>
                            {isBooked ? 'Sold' : `₹${seat.fare}`}
                          </span>
                        </button>
                      );
                    })}
                </div>

                {/* Legend */}
                <div className="flex flex-wrap items-center justify-center gap-5 mt-5 pt-3 border-t border-stone-200 dark:border-stone-700 text-xs text-stone-600 dark:text-stone-400 font-semibold">
                  <div className="flex items-center gap-1.5">
                    <div className="w-4 h-4 rounded-md bg-white border-2 border-stone-300" />
                    <span>Available</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-4 h-4 rounded-md bg-[#C25E34] border-2 border-[#8F3512]" />
                    <span>Selected</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-4 h-4 rounded-md bg-stone-300 border-2 border-stone-400 opacity-60" />
                    <span>Booked</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-4 h-4 rounded-md bg-rose-100 border-2 border-rose-400" />
                    <span>Women Berths</span>
                  </div>
                </div>
              </div>

              {/* Boarding and Dropping Points with Landmark & Timing */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Pick Boarding Location &amp; Reporting Time
                  </label>
                  <select
                    value={selectedBoardingPoint}
                    onChange={(e) => setSelectedBoardingPoint(e.target.value)}
                    className="w-full p-3 rounded-2xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs font-bold focus:outline-none"
                  >
                    {selectedBus.boardingPoints?.map((bp: string, i: number) => (
                      <option key={i} value={bp}>
                        {selectedBus.departureTime} • {bp}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Pick Destination Drop-off Location
                  </label>
                  <select
                    value={selectedDroppingPoint}
                    onChange={(e) => setSelectedDroppingPoint(e.target.value)}
                    className="w-full p-3 rounded-2xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs font-bold focus:outline-none"
                  >
                    {selectedBus.droppingPoints?.map((dp: string, i: number) => (
                      <option key={i} value={dp}>
                        {selectedBus.arrivalTime} • {dp}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* ERP Passenger Details Form (One card per selected seat) */}
              {selectedSeats.length > 0 && (
                <form onSubmit={handleConfirmBooking} className="space-y-4 pt-4 border-t border-stone-200 dark:border-stone-800">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-black text-stone-900 dark:text-white uppercase tracking-wider">
                      Passenger Details ({selectedSeats.length} Berths)
                    </h4>
                    <span className="text-xs text-stone-500 font-semibold">
                      Required for digital M-Ticket
                    </span>
                  </div>

                  {passengers.map((p, idx) => (
                    <div
                      key={p.seatNo}
                      className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
                    >
                      <div className="sm:col-span-2">
                        <span className="text-[10px] font-black uppercase text-[#C25E34] block">
                          Passenger {idx + 1}
                        </span>
                        <strong className="text-sm font-black text-stone-900 dark:text-white">
                          Berth {p.seatNo}
                        </strong>
                      </div>

                      <div className="sm:col-span-6">
                        <label className="block text-[10px] font-bold uppercase text-stone-500 mb-0.5">
                          Full Name
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Rahul Sharma"
                          value={p.name}
                          onChange={(e) => updatePassengerField(p.seatNo, 'name', e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900 text-xs font-bold focus:outline-none"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-bold uppercase text-stone-500 mb-0.5">
                          Age
                        </label>
                        <input
                          type="number"
                          required
                          min="1"
                          max="99"
                          placeholder="Age"
                          value={p.age}
                          onChange={(e) => updatePassengerField(p.seatNo, 'age', e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900 text-xs font-bold focus:outline-none text-center"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-bold uppercase text-stone-500 mb-0.5">
                          Gender
                        </label>
                        <select
                          value={p.gender}
                          onChange={(e) => updatePassengerField(p.seatNo, 'gender', e.target.value as any)}
                          className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900 text-xs font-bold focus:outline-none"
                        >
                          <option value="M">Male</option>
                          <option value="F">Female</option>
                        </select>
                      </div>
                    </div>
                  ))}

                  {/* Contact Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block text-[11px] font-bold text-stone-500 uppercase mb-1">
                        Contact Mobile (for GPS Driver SMS)
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        className="w-full p-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs font-bold focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-stone-500 uppercase mb-1">
                        Email Address (for Digital Voucher PDF)
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="guest@example.com"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        className="w-full p-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs font-bold focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Checkout Footer & Price Breakdown */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-stone-200 dark:border-stone-800">
                    <div>
                      <div className="text-xs text-stone-500 font-bold">
                        Berths Selected: <span className="text-[#C25E34]">{selectedSeats.join(', ')}</span>
                      </div>
                      <div className="text-2xl font-black text-stone-900 dark:text-white">
                        ₹{selectedSeats.length * selectedBus.fare}{' '}
                        <span className="text-xs font-normal text-stone-400">+ 5% GST</span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={bookingLoading}
                      className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#C25E34] hover:bg-[#A84A24] text-white font-black text-sm shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Ticket className="w-4 h-4" />
                      <span>{bookingLoading ? 'Issuing Official M-Ticket...' : 'Confirm & Reserve Berths'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* =========================================================================
            5. DIGITAL M-TICKET CONFIRMATION PASS MODAL (Printable / RedBus Standard)
           ========================================================================= */}
        {confirmedBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-stone-900 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 dark:border-stone-800 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-3 shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <h3 className="text-2xl font-black text-stone-900 dark:text-white">
                Bus Reservation Confirmed!
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Your M-Ticket has been dispatched via SMS &amp; Email. Present this pass at boarding.
              </p>

              {/* Boarding Pass Ticket */}
              <div className="p-5 rounded-2xl bg-stone-50 dark:bg-stone-800 text-left my-5 space-y-3 border border-stone-200 dark:border-stone-700 shadow-inner">
                <div className="flex justify-between items-center pb-3 border-b border-stone-200 dark:border-stone-700">
                  <div>
                    <span className="text-[10px] text-stone-400 font-bold uppercase block">PNR Number</span>
                    <strong className="text-base font-mono font-black text-[#C25E34]">
                      {confirmedBooking.pnr}
                    </strong>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-stone-400 font-bold uppercase block">Status</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800">
                      Confirmed
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-stone-400 block text-[10px] font-bold uppercase">Coach Operator</span>
                    <strong className="text-stone-800 dark:text-stone-200">{confirmedBooking.busOperator}</strong>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px] font-bold uppercase">Journey Date</span>
                    <strong className="text-stone-800 dark:text-stone-200">{confirmedBooking.travelDate}</strong>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px] font-bold uppercase">Route</span>
                    <strong className="text-stone-800 dark:text-stone-200">
                      {confirmedBooking.fromCity} ➔ {confirmedBooking.toCity}
                    </strong>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px] font-bold uppercase">Assigned Berths</span>
                    <span className="font-black text-emerald-700 dark:text-emerald-300">
                      {confirmedBooking.seatNumbers?.join(', ')}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-200 dark:border-stone-700 text-xs">
                  <span className="text-stone-400 block text-[10px] font-bold uppercase">Boarding Landmark</span>
                  <p className="font-semibold text-stone-800 dark:text-stone-200 mt-0.5">
                    {confirmedBooking.boardingPoint} (Departure: {confirmedBooking.departureTime})
                  </p>
                  <p className="text-[11px] text-amber-700 dark:text-amber-400 font-medium mt-1">
                    * Please arrive 15 minutes prior to departure for luggage tagging.
                  </p>
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-stone-200 dark:border-stone-700 text-sm">
                  <span className="font-bold text-stone-600 dark:text-stone-300">Total Amount Paid</span>
                  <span className="font-black text-xl text-[#C25E34]">
                    ₹{confirmedBooking.totalPayable}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex-1 py-3 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-bold text-xs hover:bg-stone-50 dark:hover:bg-stone-800 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Ticket</span>
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmedBooking(null)}
                  className="flex-1 py-3 rounded-xl bg-[#C25E34] hover:bg-[#A84A24] text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
