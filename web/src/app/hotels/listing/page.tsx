'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import {
  Search,
  Filter,
  Star,
  MapPin,
  Check,
  SlidersHorizontal,
  ChevronDown,
  Building2,
  ShieldCheck,
  Sparkles,
  Loader2,
  Map,
  X,
  Compass,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { FEATURED_HOTELS, Hotel } from '@/data/mock-data';
import { apiClient } from '@/lib/api-client';

function HotelListingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const destinationParam = searchParams.get('destination') || 'Goa';
  const checkInParam = searchParams.get('checkIn') || '2026-11-15';
  const checkOutParam = searchParams.get('checkOut') || '2026-11-18';
  const roomsParam = searchParams.get('rooms') || '1';
  const adultsParam = searchParams.get('adults') || '2';

  // Filters & MMT State
  const [selectedStars, setSelectedStars] = useState<number[]>([]);
  const [minUserRating, setMinUserRating] = useState<number>(0);
  const [filterBreakfast, setFilterBreakfast] = useState(false);
  const [filterFreeCancel, setFilterFreeCancel] = useState(false);
  const [filterPool, setFilterPool] = useState(false);
  const [filterCoupleFriendly, setFilterCoupleFriendly] = useState(false);
  const [filterAssured, setFilterAssured] = useState(false);
  const [priceMax, setPriceMax] = useState<number>(50000);
  const [sortBy, setSortBy] = useState<'POPULAR' | 'PRICE_ASC' | 'PRICE_DESC' | 'RATING'>('POPULAR');
  const [hotelList, setHotelList] = useState<Hotel[]>(FEATURED_HOTELS);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // MMT Parity Features: Taxes Toggle, Map View, Locality, Property Type
  const [showTaxes, setShowTaxes] = useState<boolean>(false);
  const [isMapOpen, setIsMapOpen] = useState<boolean>(false);
  const [selectedLocality, setSelectedLocality] = useState<string>('ALL');
  const [selectedPropertyType, setSelectedPropertyType] = useState<string>('ALL');
  const [mapSelectedHotel, setMapSelectedHotel] = useState<Hotel | null>(null);

  useEffect(() => {
    let active = true;
    async function loadHotels() {
      setIsLoading(true);
      try {
        const res = await apiClient.searchHotels({
          destination: destinationParam,
          checkInDate: checkInParam,
          checkOutDate: checkOutParam,
          rooms: Number(roomsParam),
          adults: Number(adultsParam),
          starRatings: selectedStars.length > 0 ? selectedStars : undefined,
          maxPrice: priceMax < 50000 ? priceMax : undefined,
        });
        if (active && res && res.hotels && res.hotels.length > 0) {
          setHotelList(res.hotels);
          setMapSelectedHotel(res.hotels[0]);
        }
      } catch {
        // Fallback
      } finally {
        if (active) setIsLoading(false);
      }
    }
    loadHotels();
    return () => {
      active = false;
    };
  }, [destinationParam, checkInParam, checkOutParam, roomsParam, adultsParam, selectedStars, priceMax]);

  // Extract localities present in data
  const localities = useMemo(() => {
    const set = new Set<string>();
    hotelList.forEach((h) => {
      if (h.area) set.add(h.area);
    });
    return Array.from(set);
  }, [hotelList]);

  // Filtered & Sorted Hotels
  const filteredHotels = useMemo(() => {
    return hotelList.filter((hotel) => {
      // Star Rating
      if (selectedStars.length > 0 && !selectedStars.includes(hotel.starRating || 5)) {
        return false;
      }
      // User Rating
      if (minUserRating > 0 && hotel.userRating < minUserRating) {
        return false;
      }
      // Amenities & Trust Filters
      if (filterBreakfast && !hotel.breakfastIncluded) return false;
      if (filterFreeCancel && !hotel.freeCancellation) return false;
      if (filterCoupleFriendly && !hotel.coupleFriendly) return false;
      if (filterAssured && !(hotel.userRating >= 4.5 || (hotel.starRating || 5) >= 5)) return false;
      if (
        filterPool &&
        !(((hotel as any).amenities || hotel.tags || []) as string[]).some((a: string) =>
          a.toLowerCase().includes('pool')
        )
      ) {
        return false;
      }
      // Price
      const nightly = (hotel as any).discountedPrice || hotel.pricePerNight;
      if (nightly > priceMax) return false;
      // Locality
      if (selectedLocality !== 'ALL' && hotel.area !== selectedLocality) return false;
      // Property Type
      if (selectedPropertyType !== 'ALL') {
        const pType = (hotel as any).propertyType || 'HOTEL';
        if (pType !== selectedPropertyType) return false;
      }
      return true;
    }).sort((a, b) => {
      const priceA = (a as any).discountedPrice || a.pricePerNight;
      const priceB = (b as any).discountedPrice || b.pricePerNight;
      if (sortBy === 'PRICE_ASC') return priceA - priceB;
      if (sortBy === 'PRICE_DESC') return priceB - priceA;
      if (sortBy === 'RATING') return b.userRating - a.userRating;
      return b.reviewCount - a.reviewCount; // Popularity default
    });
  }, [hotelList, selectedStars, minUserRating, filterBreakfast, filterFreeCancel, filterPool, filterCoupleFriendly, filterAssured, priceMax, selectedLocality, selectedPropertyType, sortBy]);

  const toggleStar = (star: number) => {
    setSelectedStars((prev) =>
      prev.includes(star) ? prev.filter((s) => s !== star) : [...prev, star]
    );
  };

  const clearAllFilters = () => {
    setSelectedStars([]);
    setMinUserRating(0);
    setFilterBreakfast(false);
    setFilterFreeCancel(false);
    setFilterPool(false);
    setFilterCoupleFriendly(false);
    setFilterAssured(false);
    setPriceMax(50000);
    setSelectedLocality('ALL');
    setSelectedPropertyType('ALL');
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#F4F6F8]">
      <Header activeTab="hotels" onTabChange={(t) => router.push(t === 'cabs' ? '/cabs/listing' : '/')} />

      {/* Top Sticky Modifier Strip */}
      <div className="bg-[#18181B] border-b border-blue-900 py-3 text-white sticky top-0 z-30 shadow-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-blue-300 uppercase tracking-wider text-[10px] font-bold">Destination</span>
              <strong className="text-white text-sm font-black">{destinationParam}</strong>
            </div>
            <span className="text-blue-900">|</span>
            <div>
              <span className="text-blue-300 text-[10px] font-bold">Dates</span>
              <strong className="text-white block">{checkInParam} to {checkOutParam}</strong>
            </div>
            <span className="text-blue-900">|</span>
            <div>
              <span className="text-blue-300 text-[10px] font-bold">Guests</span>
              <strong className="text-white block">{roomsParam} Room • {adultsParam} Adults</strong>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* MakeMyTrip Feature: Show Prices With Taxes Toggle */}
            <label className="flex items-center gap-2 cursor-pointer bg-white/10 hover:bg-white/15 px-3 py-1.5 rounded-xl border border-white/10 transition-colors">
              <span className="text-[11px] font-bold text-gray-200">Show Prices with Taxes &amp; Fees</span>
              <input
                type="checkbox"
                checked={showTaxes}
                onChange={(e) => setShowTaxes(e.target.checked)}
                className="h-4 w-4 text-[#C25E34] rounded focus:ring-[#C25E34] cursor-pointer"
              />
            </label>

            {/* View on Map Button */}
            <button
              onClick={() => setIsMapOpen(true)}
              className="flex items-center gap-1.5 rounded-xl bg-[#C25E34] text-[#18181B] hover:bg-[#A84F2A] px-3.5 py-1.5 font-bold text-white transition-all shadow-sm cursor-pointer"
            >
              <Map className="h-3.5 w-3.5" />
              <span>View on Map</span>
            </button>

            <Link
              href="/"
              className="text-blue-300 hover:text-white underline font-semibold transition-colors"
            >
              Modify Search
            </Link>
          </div>
        </div>
      </div>

      {/* Property Type Category Chips */}
      <div className="bg-white border-b border-slate-200 py-2.5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-slate-400 font-bold uppercase text-[10px] mr-1 shrink-0">Stay Type:</span>
          {['ALL', 'RESORT', 'HOMESTAY', 'HOTEL', 'VILLA'].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedPropertyType(type)}
              className={`px-3 py-1 rounded-full font-bold transition-all cursor-pointer shrink-0 ${
                selectedPropertyType === type
                  ? 'bg-[#C25E34] text-[#18181B] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {type === 'ALL' ? 'All Accommodations' : type === 'RESORT' ? 'Luxury Resorts' : type === 'HOMESTAY' ? 'Boutique Homestays' : type === 'VILLA' ? 'Private Villas' : '5-Star Hotels'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar Filters */}
          <aside className="w-full lg:w-72 shrink-0 space-y-5">
            <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 font-black text-base text-slate-900">
                  <Filter className="h-4 w-4 text-[#C25E34]" />
                  <span>Filters</span>
                </div>
                <button
                  onClick={clearAllFilters}
                  className="text-xs font-semibold text-[#C25E34] hover:underline cursor-pointer"
                >
                  Reset All
                </button>
              </div>

              {/* Locality Filter */}
              {localities.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">
                    Popular Localities
                  </h4>
                  <div className="space-y-1.5 text-xs">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="locality"
                        checked={selectedLocality === 'ALL'}
                        onChange={() => setSelectedLocality('ALL')}
                        className="text-[#C25E34] focus:ring-[#C25E34]"
                      />
                      <span className="font-medium text-slate-700">All Locations in {destinationParam}</span>
                    </label>
                    {localities.map((loc) => (
                      <label key={loc} className="flex items-center gap-2 cursor-pointer text-slate-600">
                        <input
                          type="radio"
                          name="locality"
                          checked={selectedLocality === loc}
                          onChange={() => setSelectedLocality(loc)}
                          className="text-[#C25E34] focus:ring-[#C25E34]"
                        />
                        <span>{loc}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Price Cap Slider */}
              <div className="border-t border-slate-100 pt-4">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-bold text-slate-900">Max Price / Night</span>
                  <strong className="text-[#C25E34] font-bold">₹{priceMax.toLocaleString('en-IN')}</strong>
                </div>
                <input
                  type="range"
                  min={3000}
                  max={50000}
                  step={1000}
                  value={priceMax}
                  onChange={(e) => setPriceMax(Number(e.target.value))}
                  className="w-full accent-[#C25E34] cursor-pointer"
                />
              </div>

              {/* Star Rating */}
              <div className="border-t border-slate-100 pt-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2.5">
                  Star Rating
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  {[5, 4, 3].map((star) => (
                    <button
                      key={star}
                      onClick={() => toggleStar(star)}
                      className={`flex items-center justify-center gap-1 rounded-xl py-2 text-xs font-bold transition-all cursor-pointer ${
                        selectedStars.includes(star)
                          ? 'bg-[#C25E34] text-[#18181B] text-white shadow-xs'
                          : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span>{star}</span>
                      <Star className="h-3 w-3 fill-current text-amber-400" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Popular Amenities */}
              <div className="border-t border-slate-100 pt-4 space-y-2 text-xs">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">
                  Key Amenities
                </h4>
                <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                  <input
                    type="checkbox"
                    checked={filterBreakfast}
                    onChange={(e) => setFilterBreakfast(e.target.checked)}
                    className="h-4 w-4 text-[#C25E34] rounded focus:ring-[#C25E34]"
                  />
                  <span>Free Breakfast</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                  <input
                    type="checkbox"
                    checked={filterFreeCancel}
                    onChange={(e) => setFilterFreeCancel(e.target.checked)}
                    className="h-4 w-4 text-[#C25E34] rounded focus:ring-[#C25E34]"
                  />
                  <span>Free Cancellation</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                  <input
                    type="checkbox"
                    checked={filterPool}
                    onChange={(e) => setFilterPool(e.target.checked)}
                    className="h-4 w-4 text-[#C25E34] rounded focus:ring-[#C25E34]"
                  />
                  <span>Swimming Pool</span>
                </label>
              </div>

              {/* Trust & Guest Suitability (MakeMyTrip / Goibibo Feature) */}
              <div className="border-t border-slate-100 pt-4 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">
                  Trust &amp; Guest Suitability
                </h4>
                <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                  <input
                    type="checkbox"
                    checked={filterCoupleFriendly}
                    onChange={(e) => setFilterCoupleFriendly(e.target.checked)}
                    className="h-4 w-4 text-[#C25E34] rounded focus:ring-[#C25E34]"
                  />
                  <span className="font-semibold text-pink-700">❤️ Couple Friendly</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                  <input
                    type="checkbox"
                    checked={filterAssured}
                    onChange={(e) => setFilterAssured(e.target.checked)}
                    className="h-4 w-4 text-[#C25E34] rounded focus:ring-[#C25E34]"
                  />
                  <span className="font-semibold text-stone-800">🛡️ Oasis Assured (4.5★+)</span>
                </label>
              </div>
            </div>
          </aside>

          {/* Right Main Results Section */}
          <section className="flex-1 space-y-4">
            {/* Results Header with Sorting */}
            <div className="rounded-2xl bg-white px-5 py-3.5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  {destinationParam}: <span className="text-[#C25E34]">{filteredHotels.length} Properties Found</span>
                </h2>
                <p className="text-[11px] text-slate-500">Verified hotels, luxury resorts &amp; homestays with instant booking</p>
              </div>

              {/* Sort Controls */}
              <div className="flex items-center gap-2">
                <span className="text-slate-500 font-bold">Sort By:</span>
                <select
                  value={sortBy}
                  onChange={(e: any) => setSortBy(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-[#C25E34] outline-none cursor-pointer"
                >
                  <option value="POPULAR">Popularity &amp; Recommended</option>
                  <option value="PRICE_ASC">Price: Low to High</option>
                  <option value="PRICE_DESC">Price: High to Low</option>
                  <option value="RATING">User Rating (Highest First)</option>
                </select>
              </div>
            </div>

            {/* Hotels Grid */}
            {isLoading ? (
              <div className="p-16 bg-white rounded-3xl border border-slate-200 text-center">
                <Loader2 className="h-8 w-8 text-[#C25E34] animate-spin mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-900">Searching real-time verified stays...</p>
              </div>
            ) : filteredHotels.length === 0 ? (
              <div className="p-16 bg-white rounded-3xl border border-slate-200 text-center">
                <Building2 className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                <h3 className="text-base font-bold text-slate-900">No Properties Match These Filters</h3>
                <p className="text-xs text-slate-500 mt-1">Try expanding your price range or resetting locality filters.</p>
                <button
                  onClick={clearAllFilters}
                  className="mt-4 px-4 py-2 bg-[#C25E34] text-[#18181B] text-white rounded-xl text-xs font-bold cursor-pointer hover:bg-[#A84F2A]"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredHotels.map((hotel) => {
                  const baseNightly = (hotel as any).discountedPrice || hotel.pricePerNight;
                  const taxAmount = Math.round(baseNightly * 0.18);
                  const displayPrice = showTaxes ? baseNightly + taxAmount : baseNightly;

                  return (
                    <div
                      key={hotel.id}
                      className="rounded-2xl bg-white border border-slate-200/90 p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col md:flex-row gap-5"
                    >
                      {/* Photo Thumbnail */}
                      <div className="relative h-52 md:h-auto md:w-72 shrink-0 rounded-2xl overflow-hidden bg-slate-100">
                        <img
                          src={hotel.imageUrl || (hotel as any).thumbnailUrl}
                          alt={hotel.name}
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                          <span className="px-2.5 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-wider">
                            {(hotel as any).propertyType || 'VERIFIED STAY'}
                          </span>
                        </div>
                      </div>

                      {/* Info & Details */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 text-amber-400">
                              {Array.from({ length: hotel.starRating || 5 }).map((_, i) => (
                                <Star key={i} className="h-3.5 w-3.5 fill-current" />
                              ))}
                            </div>
                            <span className="text-xs font-bold text-white bg-amber-500 px-2.5 py-0.5 rounded-full shadow-xs">
                              ★ {hotel.userRating} / 5
                            </span>
                          </div>

                          <h3 className="text-lg font-black text-slate-900 mt-1 leading-snug">
                            {hotel.name}
                          </h3>

                          <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                            <MapPin className="h-3.5 w-3.5 text-[#C25E34] shrink-0" />
                            <span>{hotel.area}, {hotel.city} • {hotel.distanceFromBeachOrCenter || 'Prime Location'}</span>
                          </p>

                          <div className="flex flex-wrap gap-1.5 mt-3 text-[11px]">
                            {(hotel.userRating >= 4.5 || (hotel.starRating || 5) >= 5) && (
                              <span className="px-2 py-0.5 rounded bg-stone-200/80 text-stone-900 font-black border border-stone-300 flex items-center gap-1">
                                <ShieldCheck className="h-3 w-3 text-stone-700" />
                                <span>OASIS ASSURED</span>
                              </span>
                            )}
                            {hotel.coupleFriendly && (
                              <span className="px-2 py-0.5 rounded bg-pink-50 text-pink-700 font-bold border border-pink-200">
                                ❤️ Couple Friendly
                              </span>
                            )}
                            {hotel.breakfastIncluded && (
                              <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-700 font-semibold border border-stone-200">
                                Free Breakfast Included
                              </span>
                            )}
                            {hotel.freeCancellation && (
                              <span className="px-2 py-0.5 rounded bg-blue-50 text-[#C25E34] font-semibold border border-blue-200">
                                Free Cancellation
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Price & CTA */}
                        <div className="pt-4 border-t border-slate-100 mt-4 flex items-end justify-between">
                          <div>
                            <div className="flex items-baseline gap-2">
                              <span className="text-2xl font-black text-slate-900">
                                ₹{displayPrice.toLocaleString('en-IN')}
                              </span>
                              {hotel.originalPrice && (
                                <span className="text-xs text-slate-400 line-through">
                                  ₹{(showTaxes ? Math.round(hotel.originalPrice * 1.18) : hotel.originalPrice).toLocaleString('en-IN')}
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-500 block font-medium">
                              {showTaxes
                                ? `Includes ₹${taxAmount.toLocaleString('en-IN')} taxes & fees per night`
                                : `+ ₹${taxAmount.toLocaleString('en-IN')} taxes & fees per night`}
                            </span>
                          </div>

                          <Link
                            href={`/hotels/detail/${hotel.id}`}
                            className="btn-search-gradient px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <span>View Room Plans</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* INTERACTIVE "VIEW ON MAP" MODAL (MakeMyTrip Feature) */}
      {isMapOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
            <div className="bg-[#18181B] p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Map className="h-5 w-5 text-[#C25E34]" />
                <h3 className="text-sm font-bold">
                  Interactive Map of {destinationParam} Hotels
                </h3>
              </div>
              <button
                onClick={() => setIsMapOpen(false)}
                className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4 flex-1 overflow-hidden">
              {/* Map Canvas Simulation */}
              <div className="md:col-span-2 relative bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 p-4 min-h-[350px] flex flex-col justify-between">
                <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#0066FF_1px,transparent_1px)] [background-size:16px_16px]"></div>
                
                {/* Simulated Geographic Grid with Price Pins */}
                <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 gap-3 p-2">
                  {filteredHotels.slice(0, 6).map((h) => (
                    <button
                      key={h.id}
                      onClick={() => setMapSelectedHotel(h)}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5 ${
                        mapSelectedHotel?.id === h.id
                          ? 'bg-[#C25E34] text-[#18181B] text-white scale-105 ring-2 ring-blue-900'
                          : 'bg-white text-slate-800 hover:bg-slate-50'
                      }`}
                    >
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-[#C25E34]" />
                      <span className="font-mono">₹{h.pricePerNight}</span>
                    </button>
                  ))}
                </div>

                <div className="relative z-10 bg-white/95 backdrop-blur-md p-3 rounded-xl border border-slate-200 text-xs flex items-center justify-between">
                  <span>Showing price pins across <strong>{destinationParam}</strong> coast &amp; central areas</span>
                  <span className="text-[10px] text-amber-500 font-bold">● GPS Live Synced</span>
                </div>
              </div>

              {/* Selected Hotel Card Preview */}
              <div className="rounded-2xl border border-slate-200 p-4 bg-slate-50 flex flex-col justify-between">
                {mapSelectedHotel ? (
                  <>
                    <div className="space-y-3">
                      <img
                        src={mapSelectedHotel.imageUrl || (mapSelectedHotel as any).thumbnailUrl}
                        alt={mapSelectedHotel.name}
                        className="h-36 w-full rounded-xl object-cover"
                      />
                      <span className="text-xs font-bold text-amber-500 block">★ {mapSelectedHotel.userRating} / 5</span>
                      <h4 className="text-base font-bold text-slate-900 leading-snug">
                        {mapSelectedHotel.name}
                      </h4>
                      <p className="text-xs text-slate-500">{mapSelectedHotel.area}, {mapSelectedHotel.city}</p>
                    </div>

                    <div className="pt-3 border-t border-slate-200 mt-3 flex items-center justify-between">
                      <span className="text-xl font-black text-slate-900">
                        ₹{mapSelectedHotel.pricePerNight}/night
                      </span>
                      <Link
                        href={`/hotels/detail/${mapSelectedHotel.id}`}
                        className="btn-search-gradient px-4 py-2 text-white font-bold text-xs rounded-xl cursor-pointer"
                      >
                        Book Stay
                      </Link>
                    </div>
                  </>
                ) : (
                  <p className="text-xs text-slate-500 text-center m-auto">Select a price pin on the map to preview property details.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default function HotelListingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F4F6F8] flex items-center justify-center p-8"><Loader2 className="h-8 w-8 text-[#C25E34] animate-spin" /></div>}>
      <HotelListingContent />
    </Suspense>
  );
}
