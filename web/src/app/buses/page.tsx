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
  User,
  Phone,
  Mail,
  X,
  CreditCard,
  Ticket,
  ChevronRight,
  SlidersHorizontal,
} from 'lucide-react';

export default function BusesPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Search States
  const [fromCity, setFromCity] = useState('New Delhi');
  const [toCity, setToCity] = useState('Manali');
  const [travelDate, setTravelDate] = useState('2026-11-26');
  const [busTypeFilter, setBusTypeFilter] = useState('ALL');
  const [loading, setLoading] = useState(false);

  // Data States
  const [buses, setBuses] = useState<any[]>([]);
  const [popularRoutes, setPopularRoutes] = useState<any[]>([]);

  // Seat Selection & Booking State
  const [selectedBus, setSelectedBus] = useState<any | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [activeDeck, setActiveDeck] = useState<'LOWER' | 'UPPER'>('LOWER');
  const [selectedBoardingPoint, setSelectedBoardingPoint] = useState<string>('');
  const [selectedDroppingPoint, setSelectedDroppingPoint] = useState<string>('');

  // Passenger form
  const [passengerName, setPassengerName] = useState('Rahul Sharma');
  const [passengerAge, setPassengerAge] = useState('28');
  const [passengerGender, setPassengerGender] = useState('M');
  const [passengerPhone, setPassengerPhone] = useState('+91 98765 43210');
  const [passengerEmail, setPassengerEmail] = useState('rahul.sharma@example.com');
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

  const handleSelectRoute = (from: string, to: string) => {
    setFromCity(from);
    setToCity(to);
    apiClient.searchBuses({ fromCity: from, toCity: to, travelDate }).then((res) => {
      if (res && res.buses) setBuses(res.buses);
    });
  };

  const handleOpenSeatPicker = (bus: any) => {
    setSelectedBus(bus);
    setSelectedSeats([]);
    setSelectedBoardingPoint(bus.boardingPoints?.[0] || 'Main Boarding Point');
    setSelectedDroppingPoint(bus.droppingPoints?.[0] || 'Central Dropping Point');
  };

  const toggleSeat = (seatNumber: string, isBooked: boolean) => {
    if (isBooked) return;
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatNumber));
    } else {
      if (selectedSeats.length >= 4) {
        alert('You can select a maximum of 4 seats per booking.');
        return;
      }
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  };

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSeats.length === 0) {
      alert('Please select at least 1 seat to proceed.');
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
        passengerName,
        passengerEmail,
        passengerPhone,
        baseAmount: totalFare,
      });

      if (res && res.bookingReference) {
        setConfirmedBooking(res);
        setSelectedBus(null);
      }
    } catch (err: any) {
      alert('Booking failed: ' + (err.message || 'Please try again'));
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col justify-between ${isDark ? 'bg-[#0F0A18] text-white' : 'bg-[#FAF8F5] text-stone-900'}`}>
      <Header activeTab={'buses' as any} onTabChange={() => {}} />

      <main className="flex-1 pb-16">
        {/* HERO SEARCH BANNER */}
        <section className="relative overflow-hidden pt-8 pb-10 bg-gradient-to-b from-[#2B1B17] via-[#1E1412] to-[#120B0A] text-white">
          <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#C25E34_1px,transparent_1px)] [background-size:16px_16px]" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#C25E34] text-white flex items-center gap-1.5 shadow-sm">
                <Bus className="w-3.5 h-3.5" />
                Intercity Smart Bus Network
              </span>
              <span className="text-xs text-stone-400 font-medium hidden sm:inline">
                Verified luxury sleepers &amp; express multi-axle coaches
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Book Luxury Intercity Buses across India
            </h1>
            <p className="mt-2 text-sm text-stone-300 max-w-2xl">
              Travel comfortably with Zingbus, IntrCity, VRL, and KSRTC Swift. Zero cancellation shield, live tracking, and guaranteed berths.
            </p>

            {/* SEARCH FORM CONTAINER */}
            <form onSubmit={handleSearch} className="mt-6 p-4 sm:p-5 rounded-2xl bg-white text-stone-900 shadow-xl border border-stone-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* FROM CITY */}
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 hover:border-[#C25E34] transition-all">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#C25E34]" /> From City
                  </label>
                  <input
                    type="text"
                    required
                    value={fromCity}
                    onChange={(e) => setFromCity(e.target.value)}
                    placeholder="e.g. New Delhi, Mumbai"
                    className="w-full bg-transparent font-bold text-sm text-stone-900 focus:outline-none"
                  />
                </div>

                {/* TO CITY */}
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 hover:border-[#C25E34] transition-all">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1 flex items-center gap-1">
                    <Navigation className="w-3.5 h-3.5 text-[#C25E34]" /> To Destination
                  </label>
                  <input
                    type="text"
                    required
                    value={toCity}
                    onChange={(e) => setToCity(e.target.value)}
                    placeholder="e.g. Manali, Goa, Coorg"
                    className="w-full bg-transparent font-bold text-sm text-stone-900 focus:outline-none"
                  />
                </div>

                {/* DATE */}
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 hover:border-[#C25E34] transition-all">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#C25E34]" /> Journey Date
                  </label>
                  <input
                    type="date"
                    required
                    value={travelDate}
                    onChange={(e) => setTravelDate(e.target.value)}
                    className="w-full bg-transparent font-bold text-sm text-stone-900 focus:outline-none"
                  />
                </div>

                {/* SUBMIT BUTTON */}
                <div className="flex items-center">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-full min-h-[52px] rounded-xl bg-[#C25E34] hover:bg-[#A84A24] text-white font-bold text-base flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                  >
                    <Search className="w-5 h-5" />
                    {loading ? 'Searching Coaches...' : 'Find Buses'}
                  </button>
                </div>
              </div>

              {/* POPULAR CORRIDORS QUICK CHIPS */}
              {popularRoutes.length > 0 && (
                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center gap-2 overflow-x-auto text-xs pb-1">
                  <span className="font-bold text-stone-400 uppercase tracking-wider text-[10px] whitespace-nowrap">
                    Popular Corridors:
                  </span>
                  {popularRoutes.map((r, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectRoute(r.fromCity, r.toCity)}
                      className="px-3 py-1 rounded-full bg-stone-100 hover:bg-[#C25E34] hover:text-white text-stone-700 font-semibold whitespace-nowrap transition-colors cursor-pointer"
                    >
                      {r.fromCity} ➔ {r.toCity} <span className="opacity-75 font-normal">(from ₹{r.startingFare})</span>
                    </button>
                  ))}
                </div>
              )}
            </form>
          </div>
        </section>

        {/* RESULTS SECTION */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-stone-900 dark:text-white">
                Available Buses on {fromCity} ➔ {toCity}
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Showing {buses.length} express coach departures for {travelDate}
              </p>
            </div>

            {/* Quick Filter Pill */}
            <div className="flex items-center gap-2 overflow-x-auto">
              <span className="text-xs font-bold text-stone-400 flex items-center gap-1">
                <SlidersHorizontal className="w-3.5 h-3.5" /> Type:
              </span>
              {['ALL', 'Sleeper', 'Volvo', 'Scania', 'BharatBenz'].map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    setBusTypeFilter(type);
                    apiClient.searchBuses({
                      fromCity,
                      toCity,
                      travelDate,
                      busType: type !== 'ALL' ? type : undefined,
                    }).then((r) => r && setBuses(r.buses));
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    busTypeFilter === type
                      ? 'bg-[#C25E34] text-white shadow-sm'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
                  }`}
                >
                  {type === 'ALL' ? 'All Classes' : type}
                </button>
              ))}
            </div>
          </div>

          {/* BUS LISTING CARDS */}
          {buses.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800">
              <Bus className="w-16 h-16 text-stone-300 mx-auto mb-3" />
              <h3 className="text-lg font-bold">No buses found for this exact route</h3>
              <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                Try selecting one of our popular corridors like New Delhi to Manali or Mumbai to Goa.
              </p>
              <button
                onClick={() => handleSelectRoute('New Delhi', 'Manali')}
                className="mt-4 px-5 py-2 rounded-full bg-[#C25E34] text-white text-xs font-bold cursor-pointer"
              >
                View Delhi ➔ Manali Buses
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {buses.map((bus) => (
                <div
                  key={bus.id}
                  className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-5 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    {/* Bus Operator Details */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="font-extrabold text-base text-stone-900 dark:text-white">
                          {bus.operatorName}
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Certified
                        </span>
                        {bus.rating && (
                          <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                            <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                            {bus.rating}
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-stone-500 font-medium mb-3">
                        {bus.busType} • Coach Reg: {bus.registrationNumber || 'KA-01-AB-4029'}
                      </div>

                      {/* Timeline: Departure -> Duration -> Arrival */}
                      <div className="flex items-center gap-6 py-2">
                        <div>
                          <div className="text-lg font-extrabold text-stone-900 dark:text-white">
                            {bus.departureTime}
                          </div>
                          <div className="text-xs font-semibold text-stone-600 dark:text-stone-400">
                            {bus.fromCity}
                          </div>
                        </div>

                        <div className="flex flex-col items-center px-4">
                          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                            {bus.duration}
                          </span>
                          <div className="w-24 h-0.5 bg-stone-300 dark:bg-stone-700 relative my-1">
                            <div className="w-2 h-2 rounded-full bg-[#C25E34] absolute -top-[3px] left-1/2 -translate-x-1/2" />
                          </div>
                          <span className="text-[10px] text-emerald-600 font-semibold">Express Highway</span>
                        </div>

                        <div>
                          <div className="text-lg font-extrabold text-stone-900 dark:text-white">
                            {bus.arrivalTime}
                          </div>
                          <div className="text-xs font-semibold text-stone-600 dark:text-stone-400">
                            {bus.toCity}
                          </div>
                        </div>
                      </div>

                      {/* Amenities Pills */}
                      <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-stone-100 dark:border-stone-800">
                        {bus.amenities?.map((am: string, i: number) => (
                          <span
                            key={i}
                            className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300"
                          >
                            {am}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Fare & Booking Button */}
                    <div className="lg:border-l lg:border-stone-200 dark:lg:border-stone-800 lg:pl-6 flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-3">
                      <div className="text-left lg:text-right">
                        <div className="text-xs text-stone-400 line-through">
                          ₹{bus.originalFare || Math.round(bus.fare * 1.25)}
                        </div>
                        <div className="text-2xl font-black text-stone-900 dark:text-white">
                          ₹{bus.fare}
                        </div>
                        <div className="text-[11px] font-bold text-amber-600 dark:text-amber-400">
                          {bus.availableSeats} berths available
                        </div>
                      </div>

                      <button
                        onClick={() => handleOpenSeatPicker(bus)}
                        className="px-6 py-2.5 rounded-xl bg-[#C25E34] hover:bg-[#A84A24] text-white font-bold text-sm shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        Select Seats <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* INTERACTIVE SEAT PICKER MODAL */}
        {selectedBus && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-stone-900 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-stone-200 dark:border-stone-800">
              <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-stone-800">
                <div>
                  <h3 className="text-lg font-bold text-stone-900 dark:text-white">
                    Select Berths • {selectedBus.operatorName}
                  </h3>
                  <p className="text-xs text-stone-500">
                    {selectedBus.fromCity} ➔ {selectedBus.toCity} ({travelDate})
                  </p>
                </div>
                <button
                  onClick={() => setSelectedBus(null)}
                  className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Deck Tabs (Lower / Upper) */}
              <div className="flex gap-2 my-4">
                <button
                  onClick={() => setActiveDeck('LOWER')}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    activeDeck === 'LOWER'
                      ? 'bg-[#C25E34] text-white shadow-sm'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  Lower Deck Berths (12)
                </button>
                <button
                  onClick={() => setActiveDeck('UPPER')}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    activeDeck === 'UPPER'
                      ? 'bg-[#C25E34] text-white shadow-sm'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  Upper Deck Berths (12)
                </button>
              </div>

              {/* Visual Seat Matrix */}
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700/60 mb-5">
                <div className="text-[10px] font-bold text-stone-400 uppercase tracking-widest text-center mb-3">
                  {activeDeck === 'LOWER' ? 'Steering & Driver Cabin ➔ Front' : 'Upper Panoramic Deck'}
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 max-w-md mx-auto">
                  {selectedBus.seats
                    ?.filter((s: any) => s.deck === activeDeck)
                    .map((seat: any) => {
                      const isSelected = selectedSeats.includes(seat.number);
                      const isBooked = seat.isBooked;

                      return (
                        <button
                          key={seat.id}
                          disabled={isBooked}
                          onClick={() => toggleSeat(seat.number, isBooked)}
                          className={`h-16 rounded-xl flex flex-col items-center justify-center p-1.5 border transition-all cursor-pointer ${
                            isBooked
                              ? 'bg-stone-200 dark:bg-stone-800 border-stone-300 text-stone-400 cursor-not-allowed opacity-60'
                              : isSelected
                              ? 'bg-[#C25E34] border-[#A84A24] text-white shadow-md scale-105 font-black'
                              : 'bg-white dark:bg-stone-900 border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white hover:border-[#C25E34]'
                          }`}
                        >
                          <span className="text-[11px] font-extrabold">{seat.number}</span>
                          <span className="text-[9px] font-semibold opacity-80">
                            {isBooked ? 'Booked' : `₹${seat.fare}`}
                          </span>
                        </button>
                      );
                    })}
                </div>

                {/* Legend */}
                <div className="flex items-center justify-center gap-6 mt-4 pt-3 border-t border-stone-200 dark:border-stone-700 text-[11px] text-stone-500 font-medium">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3.5 h-3.5 rounded bg-white border border-stone-300" /> Available
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3.5 h-3.5 rounded bg-[#C25E34]" /> Selected
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3.5 h-3.5 rounded bg-stone-300" /> Booked
                  </div>
                </div>
              </div>

              {/* Boarding & Dropping Points */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="block text-xs font-bold text-stone-600 dark:text-stone-400 mb-1">
                    Select Boarding Point
                  </label>
                  <select
                    value={selectedBoardingPoint}
                    onChange={(e) => setSelectedBoardingPoint(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs font-semibold focus:outline-none"
                  >
                    {selectedBus.boardingPoints?.map((bp: string, i: number) => (
                      <option key={i} value={bp}>
                        {bp}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-600 dark:text-stone-400 mb-1">
                    Select Dropping Point
                  </label>
                  <select
                    value={selectedDroppingPoint}
                    onChange={(e) => setSelectedDroppingPoint(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs font-semibold focus:outline-none"
                  >
                    {selectedBus.droppingPoints?.map((dp: string, i: number) => (
                      <option key={i} value={dp}>
                        {dp}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Passenger Contact Form */}
              <form onSubmit={handleConfirmBooking} className="space-y-3 pt-3 border-t border-stone-200 dark:border-stone-800">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-stone-500 uppercase mb-1">
                      Lead Passenger Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={passengerName}
                      onChange={(e) => setPassengerName(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs font-semibold focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-stone-500 uppercase mb-1">Age &amp; Gender</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        required
                        value={passengerAge}
                        onChange={(e) => setPassengerAge(e.target.value)}
                        className="w-16 p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs font-semibold focus:outline-none text-center"
                      />
                      <select
                        value={passengerGender}
                        onChange={(e) => setPassengerGender(e.target.value)}
                        className="flex-1 p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs font-semibold focus:outline-none"
                      >
                        <option value="M">Male</option>
                        <option value="F">Female</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-500 uppercase mb-1">Mobile Number</label>
                    <input
                      type="tel"
                      required
                      value={passengerPhone}
                      onChange={(e) => setPassengerPhone(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs font-semibold focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-stone-500 uppercase mb-1">Email for M-Ticket</label>
                    <input
                      type="email"
                      required
                      value={passengerEmail}
                      onChange={(e) => setPassengerEmail(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs font-semibold focus:outline-none"
                    />
                  </div>
                </div>

                {/* Price Summary & Submit */}
                <div className="flex items-center justify-between pt-4 border-t border-stone-200 dark:border-stone-800">
                  <div>
                    <div className="text-xs text-stone-500 font-semibold">
                      Selected Berths: {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}
                    </div>
                    <div className="text-xl font-black text-stone-900 dark:text-white">
                      ₹{selectedSeats.length * selectedBus.fare} <span className="text-xs font-normal text-stone-400">+ 5% GST</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={selectedSeats.length === 0 || bookingLoading}
                    className="px-7 py-3 rounded-xl bg-[#C25E34] hover:bg-[#A84A24] text-white font-bold text-sm shadow-md transition-all cursor-pointer disabled:opacity-50"
                  >
                    {bookingLoading ? 'Issuing Ticket...' : 'Confirm Reservation'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* CONFIRMED BOOKING PASS MODAL */}
        {confirmedBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-stone-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 dark:border-stone-800 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4">
                <Ticket className="w-8 h-8" />
              </div>

              <h3 className="text-2xl font-black text-stone-900 dark:text-white">
                Bus Ticket Confirmed!
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Your luxury bus ticket has been confirmed. M-Ticket sent via SMS &amp; Email.
              </p>

              {/* Digital Pass Card */}
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800 text-left my-5 space-y-2.5 border border-stone-200 dark:border-stone-700">
                <div className="flex justify-between items-center pb-2 border-b border-stone-200 dark:border-stone-700">
                  <span className="text-xs text-stone-400 font-bold uppercase">PNR Number</span>
                  <span className="text-sm font-mono font-extrabold text-[#C25E34]">
                    {confirmedBooking.pnr}
                  </span>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="text-stone-500">Service</span>
                  <span className="font-bold">{confirmedBooking.busOperator}</span>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="text-stone-500">Route</span>
                  <span className="font-bold">
                    {confirmedBooking.fromCity} ➔ {confirmedBooking.toCity}
                  </span>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="text-stone-500">Departure</span>
                  <span className="font-bold">
                    {confirmedBooking.departureTime} ({confirmedBooking.travelDate})
                  </span>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="text-stone-500">Assigned Berths</span>
                  <span className="font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                    {confirmedBooking.seatNumbers?.join(', ')}
                  </span>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="text-stone-500">Boarding Point</span>
                  <span className="font-semibold text-right max-w-[200px] truncate">
                    {confirmedBooking.boardingPoint}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-stone-200 dark:border-stone-700 text-sm">
                  <span className="font-bold">Total Paid</span>
                  <span className="font-black text-[#C25E34]">
                    ₹{confirmedBooking.totalPayable}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setConfirmedBooking(null)}
                className="w-full py-3 rounded-xl bg-[#C25E34] text-white font-bold text-sm cursor-pointer shadow-md hover:bg-[#A84A24]"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
