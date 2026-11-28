'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import {
  Star,
  MapPin,
  Check,
  ShieldCheck,
  Wifi,
  Waves,
  Coffee,
  Car,
  Clock,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Info,
  Maximize2,
  X,
  CheckCircle2,
  AlertCircle,
  FileText,
  Compass,
  Phone,
  BedDouble,
  Sliders,
  Users,
  MessageSquare,
  ThumbsUp,
} from 'lucide-react';
import type { Hotel } from '@/data/mock-data';
import { apiClient } from '@/lib/api-client';

function HotelDetailContent() {
  const params = useParams();
  const router = useRouter();
  const hotelId = params?.id as string;

  const [hotel, setHotel] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRoomId, setSelectedRoomId] = useState('');
  const [selectedMealPlans, setSelectedMealPlans] = useState<Record<string, 'ROOM_ONLY' | 'BREAKFAST' | 'ALL_MEALS'>>({});
  const [activeTab, setActiveTab] = useState<'rooms' | 'comparison' | 'amenities' | 'policies' | 'location' | 'reviews'>('rooms');
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryActiveIdx, setGalleryActiveIdx] = useState(0);
  const [reviewsList, setReviewsList] = useState<any[]>([]);

  useEffect(() => {
    let active = true;
    async function loadHotel() {
      setIsLoading(true);
      try {
        const data = await apiClient.getHotelDetails(hotelId);
        if (active && data) {
          setHotel(data);
          if (data.rooms && data.rooms.length > 0) {
            setSelectedRoomId(data.rooms[0].id);
          }
        }
      } catch (err) {
        console.error('Failed to load hotel detail from database:', err);
      } finally {
        if (active) setIsLoading(false);
      }
    }
    if (hotelId) loadHotel();
    return () => {
      active = false;
    };
  }, [hotelId]);

  useEffect(() => {
    let active = true;
    async function loadReviews() {
      if (!hotel?.id) return;
      try {
        const res = await apiClient.getHotelReviews(hotel.id);
        if (active && res && res.reviews && res.reviews.length > 0) {
          setReviewsList(res.reviews);
        }
      } catch {
        // fallback
      }
    }
    loadReviews();
    return () => {
      active = false;
    };
  }, [hotel?.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col justify-between bg-[#F4F6F8]">
        <Header activeTab="hotels" onTabChange={(t) => router.push(t === 'cabs' ? '/cabs/listing' : '/')} />
        <div className="mx-auto max-w-7xl px-4 py-20 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#C25E34] border-r-transparent align-[-0.125em]" />
          <p className="mt-4 text-sm text-slate-500 font-semibold">Loading property details from database...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="min-h-screen flex flex-col justify-between bg-[#F4F6F8]">
        <Header activeTab="hotels" onTabChange={(t) => router.push(t === 'cabs' ? '/cabs/listing' : '/')} />
        <div className="mx-auto max-w-7xl px-4 py-20 text-center">
          <h2 className="text-2xl font-bold text-slate-900">Property Not Found</h2>
          <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">
            This property could not be found in the database. It may have been removed or is pending approval.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <Link href="/hotels/listing" className="px-5 py-2.5 rounded-xl bg-[#C25E34] text-white text-sm font-bold">
              Browse Hotels
            </Link>
            <Link href="/partner" className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-sm font-bold hover:bg-slate-100">
              List Your Property
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const hotelRooms = hotel.rooms && hotel.rooms.length > 0 ? hotel.rooms : [
    {
      id: 'room_std',
      name: 'Deluxe Room',
      sqft: 350,
      bed: '1 King Bed',
      price: hotel.pricePerNight || 4500,
      inclusions: ['Free High-Speed WiFi'],
      totalInventory: 10,
      availableRooms: 10,
    },
  ];

  const selectedRoom =
    hotelRooms.find((r: any) => r.id === selectedRoomId) || hotelRooms[0];

  const galleryImages = Array.isArray(hotel.images) && hotel.images.length > 0
    ? hotel.images
    : [hotel.thumbnailUrl || hotel.imageUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'];

  const handleBookNow = (targetRoomId?: string) => {
    const rId = targetRoomId || selectedRoom.id;
    const targetRoom = hotelRooms.find((r: any) => r.id === rId) || selectedRoom;
    const plan = selectedMealPlans[rId] || 'BREAKFAST';
    const extra = plan === 'BREAKFAST' ? 1200 : plan === 'ALL_MEALS' ? 2800 : 0;
    const finalPrice = targetRoom.price + extra;
    const planLabel =
      plan === 'BREAKFAST'
        ? 'Free Buffet Breakfast (CP)'
        : plan === 'ALL_MEALS'
        ? 'Breakfast + Dinner (MAP)'
        : 'Room Only (EP)';

    router.push(
      `/hotels/checkout?hotelId=${hotel.id}&roomId=${targetRoom.id}&price=${finalPrice}&mealPlan=${encodeURIComponent(
        planLabel
      )}`
    );
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#F4F6F8]">
      <Header activeTab="hotels" onTabChange={(t) => router.push(t === 'cabs' ? '/cabs/listing' : '/')} />

      {/* Breadcrumbs */}
      <div className="bg-white border-b border-slate-200 py-2.5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center gap-2 text-xs text-slate-500">
          <Link href="/" className="hover:text-[#C25E34] transition-colors">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href={`/hotels/listing?destination=${hotel.city}`} className="hover:text-[#C25E34] transition-colors">
            Hotels in {hotel.city}
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-slate-900 font-bold truncate text-sm">{hotel.name}</span>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full space-y-6">
        {/* Hotel Header Overview Card */}
        <div className="rounded-2xl bg-white p-6 shadow-xs border border-slate-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <div className="flex items-center text-amber-400">
                  {Array.from({ length: Number(hotel.starRating) || 4 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <span className="rounded bg-blue-50 text-[#C25E34] border border-blue-200 font-bold px-2 py-0.5 text-xs uppercase tracking-wider">
                  {(Array.isArray(hotel.tags) && hotel.tags[0]) || 'Verified Stay'}
                </span>
                <span className="rounded-full bg-stone-100 text-stone-800 border border-stone-200 text-[10px] font-bold px-2 py-0.5">
                  ✓ Verified Quality Partner
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                {hotel.name}
              </h1>
              <p className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-500 mt-1">
                <MapPin className="h-4 w-4 text-[#C25E34] shrink-0" />
                <span>{hotel.area || hotel.city}, {hotel.city} • {hotel.distanceFromBeach || hotel.distanceFromBeachOrCenter || 'Prime Location'}</span>
              </p>
            </div>

            {/* MMT 4-Pillar Rating Box */}
            <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 p-4 rounded-2xl">
              <div className="rounded-2xl bg-amber-500 text-white p-3 text-center shadow-xs">
                <span className="text-2xl font-black block">★ {hotel.userRating}</span>
                <span className="text-[10px] uppercase font-bold tracking-wider">/ 5.0</span>
              </div>
              <div className="text-xs space-y-0.5">
                <span className="font-bold text-slate-900 block text-sm">
                  {hotel.ratingWord || 'Exceptional Stay'}
                </span>
                <span className="text-slate-500 text-[11px] block">
                  Based on {hotel.reviewCount} verified guest reviews
                </span>
                <div className="flex gap-2 text-[10px] text-slate-600 pt-1 font-bold">
                  <span>Cleanliness: 4.9★</span>
                  <span>•</span>
                  <span>Service: 4.8★</span>
                  <span>•</span>
                  <span>Location: 4.9★</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* High-Res Photo Gallery (MakeMyTrip 5-Grid Layout with Lightbox) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 h-80 sm:h-96 rounded-2xl overflow-hidden relative">
          <div className="md:col-span-2 h-full relative group cursor-pointer" onClick={() => { setGalleryActiveIdx(0); setIsGalleryOpen(true); }}>
            <img
              src={galleryImages[0]}
              alt={hotel.name}
              className="h-full w-full object-cover group-hover:scale-102 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
            <span className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-xl">
              Exterior &amp; Panorama
            </span>
          </div>

          <div className="hidden md:flex flex-col gap-3">
            <div className="h-1/2 relative group cursor-pointer overflow-hidden rounded-xl" onClick={() => { setGalleryActiveIdx(1); setIsGalleryOpen(true); }}>
              <img src={galleryImages[1]} alt="Suite" className="h-full w-full object-cover group-hover:scale-105 transition-transform" />
            </div>
            <div className="h-1/2 relative group cursor-pointer overflow-hidden rounded-xl" onClick={() => { setGalleryActiveIdx(2); setIsGalleryOpen(true); }}>
              <img src={galleryImages[2]} alt="Dining" className="h-full w-full object-cover group-hover:scale-105 transition-transform" />
            </div>
          </div>

          <div className="hidden md:flex flex-col gap-3">
            <div className="h-1/2 relative group cursor-pointer overflow-hidden rounded-xl" onClick={() => { setGalleryActiveIdx(3); setIsGalleryOpen(true); }}>
              <img src={galleryImages[3]} alt="Pool" className="h-full w-full object-cover group-hover:scale-105 transition-transform" />
            </div>
            <div className="h-1/2 relative group cursor-pointer overflow-hidden rounded-xl" onClick={() => { setGalleryActiveIdx(4); setIsGalleryOpen(true); }}>
              <img src={galleryImages[4]} alt="Spa" className="h-full w-full object-cover group-hover:scale-105 transition-transform" />
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold text-xs gap-1">
                <Maximize2 className="h-4 w-4" />
                <span>+ View All Photos</span>
              </div>
            </div>
          </div>
        </div>

        {/* MakeMyTrip Sticky Section Navigation Bar */}
        <div className="border-b border-slate-200 bg-white rounded-2xl px-4 py-2 sticky top-16 z-20 shadow-xs flex items-center gap-6 text-xs font-bold">
          <button
            onClick={() => setActiveTab('rooms')}
            className={`pb-1 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'rooms' ? 'border-[#C25E34] text-[#C25E34]' : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Room Types &amp; Rate Plans
          </button>
          <button
            onClick={() => setActiveTab('comparison')}
            className={`pb-1 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'comparison' ? 'border-[#C25E34] text-[#C25E34]' : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Compare Rooms
          </button>
          <button
            onClick={() => setActiveTab('amenities')}
            className={`pb-1 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'amenities' ? 'border-[#C25E34] text-[#C25E34]' : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Amenities &amp; Facilities
          </button>
          <button
            onClick={() => setActiveTab('policies')}
            className={`pb-1 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'policies' ? 'border-[#C25E34] text-[#C25E34]' : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            House Rules &amp; Policies
          </button>
          <button
            onClick={() => setActiveTab('location')}
            className={`pb-1 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'location' ? 'border-[#C25E34] text-[#C25E34]' : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Location &amp; Proximity
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-1 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'reviews' ? 'border-[#C25E34] text-[#C25E34]' : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Guest Reviews ({reviewsList.length || hotel.reviewCount})
          </button>
        </div>

        {/* TAB 1: ROOM TYPES & RATE PLANS MATRIX */}
        {activeTab === 'rooms' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900">
              Select Room &amp; Meal Package
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {hotelRooms.map((room: any) => {
                const isSelected = selectedRoomId === room.id;
                return (
                  <div
                    key={room.id}
                    className={`rounded-2xl bg-white border-2 p-6 flex flex-col justify-between transition-all ${
                      isSelected
                        ? 'border-[#C25E34] shadow-md bg-blue-50/20'
                        : 'border-slate-200 shadow-xs'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] uppercase font-bold text-[#C25E34] tracking-wider">
                          {room.sqft} sq.ft • {room.bed}
                        </span>
                        {isSelected && (
                          <span className="flex items-center gap-1 text-[10px] font-black text-[#C25E34] bg-blue-100 px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="h-3 w-3" />
                            <span>SELECTED</span>
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl font-black text-slate-900">
                        {room.name}
                      </h3>

                      <ul className="mt-4 space-y-2 text-xs text-slate-600">
                        {room.inclusions.map((inc: string, i: number) => (
                          <li key={i} className="flex items-center gap-2">
                            <Check className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                            <span>{inc}</span>
                          </li>
                        ))}
                      </ul>

                      {/* MakeMyTrip Feature: Selectable Meal Plans */}
                      <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5">
                        <span className="text-[10px] uppercase font-black tracking-wider text-slate-500 block mb-1">
                          Choose Meal Package
                        </span>
                        {[
                          { id: 'ROOM_ONLY', label: 'Room Only (EP)', extra: 0 },
                          { id: 'BREAKFAST', label: 'Buffet Breakfast (CP)', extra: 1200, popular: true },
                          { id: 'ALL_MEALS', label: 'Breakfast + Lunch/Dinner (MAP)', extra: 2800 },
                        ].map((plan) => {
                          const curPlan = selectedMealPlans[room.id] || 'BREAKFAST';
                          const isChecked = curPlan === plan.id;
                          return (
                            <label
                              key={plan.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedMealPlans((prev) => ({ ...prev, [room.id]: plan.id as any }));
                              }}
                              className={`flex items-center justify-between p-2 rounded-xl border text-xs cursor-pointer transition-all ${
                                isChecked
                                  ? 'border-[#C25E34] bg-[#FAF8F5] text-[#18181B] font-bold'
                                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <input
                                  type="radio"
                                  name={`meal_${room.id}`}
                                  checked={isChecked}
                                  onChange={() => setSelectedMealPlans((prev) => ({ ...prev, [room.id]: plan.id as any }))}
                                  className="text-[#C25E34] focus:ring-[#C25E34]"
                                />
                                <span className="text-xs">{plan.label}</span>
                                {plan.popular && (
                                  <span className="text-[9px] bg-stone-200 text-stone-800 px-1.5 py-0.2 rounded font-black">
                                    RECOMMENDED
                                  </span>
                                )}
                              </div>
                              <span className="text-xs font-bold text-slate-900">
                                {plan.extra === 0 ? 'Included' : `+₹${plan.extra.toLocaleString('en-IN')}`}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    <div className="pt-6 border-t border-slate-100 mt-6 flex items-center justify-between">
                      {(() => {
                        const curPlan = selectedMealPlans[room.id] || 'BREAKFAST';
                        const extra = curPlan === 'BREAKFAST' ? 1200 : curPlan === 'ALL_MEALS' ? 2800 : 0;
                        const dynamicPrice = room.price + extra;
                        return (
                          <div>
                            <span className="text-[10px] text-slate-400 block font-medium">Nightly Price</span>
                            <span className="text-2xl font-black text-slate-900">
                              ₹{dynamicPrice.toLocaleString('en-IN')}
                            </span>
                            <span className="text-[10px] text-slate-400 block font-medium">+ ₹{Math.round(dynamicPrice * 0.18)} taxes</span>
                          </div>
                        );
                      })()}

                      <button
                        onClick={() => {
                          setSelectedRoomId(room.id);
                          handleBookNow(room.id);
                        }}
                        className="btn-search-gradient px-4 py-2.5 rounded-xl text-xs font-bold text-white shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <span>Reserve</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: ROOM COMPARISON TABLE (MakeMyTrip Feature) */}
        {activeTab === 'comparison' && (
          <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-5 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Side-by-Side Room Comparison</h3>
              <p className="text-xs text-slate-500">Compare room dimensions, bedding configurations, and package inclusions.</p>
            </div>

            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="p-4">Room Category</th>
                    <th className="p-4">Room Dimensions</th>
                    <th className="p-4">Bed Type</th>
                    <th className="p-4">Meal Plan Options</th>
                    <th className="p-4">Cancellation Policy</th>
                    <th className="p-4">Nightly Price</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {hotelRooms.map((r: any) => (
                    <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4 font-bold text-sm text-slate-900">{r.name}</td>
                      <td className="p-4 text-slate-600">{r.sqft} sq.ft</td>
                      <td className="p-4 text-slate-600">{r.bed}</td>
                      <td className="p-4">
                        <span className="font-bold text-stone-700 block">Free Breakfast (CP)</span>
                        <span className="text-[10px] text-slate-400">Upgrade to MAP at checkout</span>
                      </td>
                      <td className="p-4 text-stone-700 font-semibold">Free cancellation up to 48 hrs prior</td>
                      <td className="p-4 font-black text-base text-slate-900">₹{r.price}</td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedRoomId(r.id);
                            handleBookNow();
                          }}
                          className="px-3 py-1.5 bg-[#C25E34] text-[#18181B] hover:bg-[#A84F2A] text-white rounded-lg font-bold text-xs cursor-pointer shadow-xs"
                        >
                          Select
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: AMENITIES */}
        {activeTab === 'amenities' && (
          <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">Amenities &amp; Facilities</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                <Wifi className="h-5 w-5 text-[#C25E34]" />
                <span className="font-bold text-slate-800">High-Speed Wi-Fi</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                <Waves className="h-5 w-5 text-[#C25E34]" />
                <span className="font-bold text-slate-800">Swimming Pool</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                <Coffee className="h-5 w-5 text-[#C25E34]" />
                <span className="font-bold text-slate-800">Breakfast Included</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                <Car className="h-5 w-5 text-[#C25E34]" />
                <span className="font-bold text-slate-800">Free Parking</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: PROPERTY POLICIES (MakeMyTrip Feature) */}
        {activeTab === 'policies' && (
          <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-xs space-y-5 text-xs">
            <h3 className="text-base font-bold text-slate-900">Property Rules &amp; House Policies</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                <strong className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-[#C25E34]" />
                  <span>Check-In &amp; Check-Out Hours</span>
                </strong>
                <p className="text-slate-600">Standard Check-In: <strong>02:00 PM</strong> | Standard Check-Out: <strong>11:00 AM</strong></p>
                <p className="text-[11px] text-slate-400">Early check-in subject to room availability upon arrival.</p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                <strong className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-amber-500" />
                  <span>Guest Identification Mandate</span>
                </strong>
                <p className="text-slate-600">Government approved photo ID required for all adult guests (Passport, Aadhaar, Voter Card, Driving License). <em>PAN Cards are not accepted.</em></p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                <strong className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-[#C25E34]" />
                  <span>Couples &amp; Family Friendly</span>
                </strong>
                <p className="text-slate-600">Unmarried couples welcome with valid government proof of identification.</p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                <strong className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <span>Cancellation &amp; Refund Window</span>
                </strong>
                <p className="text-slate-600">Free cancellation up to 48 hours before check-in. Non-refundable within 48 hours of reservation date unless Zero-Cancellation protection was purchased at checkout.</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: LOCATION PROXIMITY (MakeMyTrip Feature) */}
        {activeTab === 'location' && (
          <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-xs space-y-4 text-xs">
            <h3 className="text-base font-bold text-slate-900">Location &amp; Nearby Transit Proximity</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Airport Access</span>
                <strong className="text-sm font-bold text-slate-900">Dabolim Airport: 28 km</strong>
                <p className="text-slate-500 text-[11px] mt-0.5">Approx 45 mins via private chauffeur cab</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Railway Terminal</span>
                <strong className="text-sm font-bold text-slate-900">Madgaon Junction: 38 km</strong>
                <p className="text-slate-500 text-[11px] mt-0.5">Thivim Railway Station: 24 km</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Beachfront Landmark</span>
                <strong className="text-sm font-bold text-slate-900">Sinquerim Beach: 400 m</strong>
                <p className="text-slate-500 text-[11px] mt-0.5">Direct private footpath through resort gardens</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: GUEST REVIEWS & SOCIAL PROOF (MakeMyTrip Feature) */}
        {activeTab === 'reviews' && (
          <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-xs space-y-6 text-xs">
            {/* Header with Write Review CTA */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-5 border-b border-slate-100 gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Verified Traveler Reviews &amp; Ratings</h3>
                <p className="text-slate-500">Every review is authentic and submitted by a confirmed WanderStay guest</p>
              </div>

              <Link
                href={`/account/reviews/write?hotelId=${hotel.id}`}
                className="btn-search-gradient px-4 py-2 rounded-xl text-xs font-black shadow-sm flex items-center gap-1.5 cursor-pointer hover:shadow-md"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Write a Review</span>
              </Link>
            </div>

            {/* Scorecard Overview & 4-Pillar Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50 p-5 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-2xl bg-[#18181B] text-[#C25E34] flex flex-col items-center justify-center shrink-0 shadow-sm">
                  <span className="text-2xl font-black block">★ {hotel.userRating}</span>
                  <span className="text-[9px] uppercase font-bold text-white/70">/ 5.0</span>
                </div>
                <div>
                  <strong className="text-sm font-bold text-slate-900 block">{hotel.ratingWord || 'Exceptional'}</strong>
                  <span className="text-slate-500 text-[11px] block">{reviewsList.length} verified traveler opinions</span>
                  <span className="text-[10px] font-bold text-[#C25E34] mt-0.5 inline-block">✓ 100% Verified Stays</span>
                </div>
              </div>

              {/* Progress Bars */}
              <div className="md:col-span-2 grid grid-cols-2 gap-x-6 gap-y-2">
                <div>
                  <div className="flex justify-between text-[11px] font-semibold text-slate-700 mb-1">
                    <span>Cleanliness &amp; Hygiene</span>
                    <span className="text-[#C25E34] font-bold">4.9 / 5</span>
                  </div>
                  <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-[#C25E34] rounded-full" style={{ width: '98%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] font-semibold text-slate-700 mb-1">
                    <span>Staff &amp; Hospitality</span>
                    <span className="text-[#C25E34] font-bold">4.8 / 5</span>
                  </div>
                  <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-[#C25E34] rounded-full" style={{ width: '96%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] font-semibold text-slate-700 mb-1">
                    <span>Location &amp; Ambience</span>
                    <span className="text-[#C25E34] font-bold">4.9 / 5</span>
                  </div>
                  <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-[#C25E34] rounded-full" style={{ width: '98%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] font-semibold text-slate-700 mb-1">
                    <span>Dining &amp; Amenities</span>
                    <span className="text-[#C25E34] font-bold">4.7 / 5</span>
                  </div>
                  <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-[#C25E34] rounded-full" style={{ width: '94%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* List of Verified Reviews */}
            <div className="space-y-4 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Recent Guest Feedback
              </h4>

              <div className="space-y-3">
                {reviewsList.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-xl border border-slate-100 bg-white hover:border-[#D4ECE5] transition-colors space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-[#FDF8F6] text-[#C25E34] font-black flex items-center justify-center text-xs">
                          {rev.guestName?.charAt(0) || 'G'}
                        </div>
                        <div>
                          <strong className="text-slate-900 block font-bold text-xs">{rev.guestName}</strong>
                          <span className="text-[10px] text-slate-400">Stayed {rev.stayMonth || 'Recently'} • {rev.roomType || 'Deluxe Suite'}</span>
                        </div>
                      </div>

                      <span className="px-2 py-0.5 rounded-full bg-[#18181B] text-[#C25E34] font-black text-[10px]">
                        ★ {rev.rating} / 5
                      </span>
                    </div>

                    <h5 className="font-bold text-slate-900 text-xs">{rev.title}</h5>
                    <p className="text-slate-600 leading-relaxed text-xs">{rev.comment}</p>

                    <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-50">
                      <span className="flex items-center gap-1 text-[#C25E34] font-semibold">
                        <CheckCircle2 className="h-3 w-3" /> Certified Booking
                      </span>
                      <span className="flex items-center gap-1 hover:text-slate-600 cursor-pointer">
                        <ThumbsUp className="h-3 w-3" /> Helpful ({rev.helpfulCount || 12})
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* FULL-SCREEN PHOTO GALLERY LIGHTBOX (MakeMyTrip Feature) */}
      {isGalleryOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between p-4 sm:p-6 text-white">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold">
              {hotel.name} — Photo {galleryActiveIdx + 1} of {galleryImages.length}
            </span>
            <button
              onClick={() => setIsGalleryOpen(false)}
              className="h-10 w-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center cursor-pointer transition-colors"
            >
              <X className="h-5 w-5 text-white" />
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center p-4">
            <img
              src={galleryImages[galleryActiveIdx]}
              alt={`Photo ${galleryActiveIdx}`}
              className="max-h-[75vh] max-w-full rounded-2xl object-contain shadow-2xl"
            />
          </div>

          <div className="flex items-center justify-center gap-3 overflow-x-auto pb-2">
            {galleryImages.map((img: string, i: number) => (
              <button
                key={i}
                onClick={() => setGalleryActiveIdx(i)}
                className={`h-16 w-24 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                  galleryActiveIdx === i ? 'border-[#C25E34] scale-105' : 'border-white/30 opacity-60'
                }`}
              >
                <img src={img} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default function HotelDetailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F4F6F8] flex items-center justify-center p-8 text-[#C25E34]">Loading property details...</div>}>
      <HotelDetailContent />
    </Suspense>
  );
}
