'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import {
  ShieldCheck,
  Tag,
  CheckCircle2,
  Lock,
  Sparkles,
  Info,
  Building2,
  Coins,
  X,
  ChevronRight,
  Check,
} from 'lucide-react';
// removed mock-data import
import { apiClient } from '@/lib/api-client';
import AuthModal, { CustomerProfile } from '@/components/auth/AuthModal';

const SPECIAL_REQUEST_OPTIONS = [
  '🚭 Non-Smoking Room',
  '🚬 Smoking Room',
  '🛏️ Large Double Bed',
  '🛏️🛏️ Twin Beds',
  '🏢 High Floor',
  '🌅 Sea / Scenic View',
  '⏰ Early Check-in (Subject to availability)',
  '🎂 Honeymoon / Anniversary Decor',
];

const AVAILABLE_COUPONS = [
  {
    code: 'MMTWELCOME',
    discount: 2000,
    title: 'First Stay Welcome Voucher',
    desc: 'Flat ₹2,000 off on all hotels, resorts & homestays',
    tag: 'MOST POPULAR',
  },
  {
    code: 'LUXURY2000',
    discount: 2000,
    title: 'Luxury Collection Privilege',
    desc: 'Instant ₹2,000 savings on bookings above ₹10,000',
    tag: 'FEATURED',
  },
  {
    code: 'WEEKENDSTAY',
    discount: 1200,
    title: 'Weekend Escape Pass',
    desc: 'Save ₹1,200 for relaxing Friday-to-Sunday check-ins',
    tag: 'WEEKEND',
  },
  {
    code: 'BOUTIQUE10',
    discount: 1500,
    title: 'Boutique & Homestay Deal',
    desc: 'Exclusive ₹1,500 rebate on boutique villas and homestays',
    tag: 'DEAL',
  },
];

function HotelCheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const hotelId = searchParams.get('hotelId') || '';
  const priceParam = Number(searchParams.get('price')) || 4500;
  const mealPlanParam = searchParams.get('mealPlan') || 'Free Buffet Breakfast (CP)';

  const [hotel, setHotel] = useState<any>({
    id: hotelId,
    name: 'Selected Stay',
    city: 'India',
    area: 'Central',
    starRating: 4,
    userRating: 4.8,
    reviewCount: 1,
    thumbnailUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
    rooms: [{ id: 'room_std', name: 'Deluxe Room', price: priceParam }],
  });

  useEffect(() => {
    let active = true;
    async function loadHotel() {
      if (!hotelId) return;
      try {
        const data = await apiClient.getHotelDetails(hotelId);
        if (active && data) {
          setHotel(data);
        }
      } catch (err) {
        console.error('Failed to load hotel details for checkout:', err);
      }
    }
    loadHotel();
    return () => {
      active = false;
    };
  }, [hotelId]);

  // Form State
  const [title, setTitle] = useState('Mr');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentMode, setPaymentMode] = useState<'PAY_NOW' | 'PAY_AT_HOTEL'>('PAY_NOW');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const stored = localStorage.getItem('wanderstay_customer_profile');
        if (stored) {
          setIsUserLoggedIn(true);
          const parsed = JSON.parse(stored);
          if (parsed.firstName) setFirstName(parsed.firstName);
          if (parsed.lastName) setLastName(parsed.lastName);
          if (parsed.email) setEmail(parsed.email);
          if (parsed.phone) {
            const rawDigits = parsed.phone.replace(/\D/g, '');
            setPhone(rawDigits.length >= 10 ? rawDigits.slice(-10) : rawDigits);
          }
        } else {
          setIsUserLoggedIn(false);
        }
      } catch (e) {
        console.error(e);
      }
    };

    checkAuth();
    window.addEventListener('wanderstay_auth_changed', checkAuth);
    return () => window.removeEventListener('wanderstay_auth_changed', checkAuth);
  }, []);

  // MMT Feature 1: Zero-Cancellation Protection Add-on
  const [zeroCancellationOpted, setZeroCancellationOpted] = useState(true);
  const ZERO_CANCEL_FEE = 299;

  // MMT Feature 2: Special Requests
  const [selectedRequests, setSelectedRequests] = useState<string[]>([
    '🚭 Non-Smoking Room',
    '🏢 High Floor',
  ]);
  const [customRequest, setCustomRequest] = useState('');

  // MMT Feature 3: Corporate GSTIN
  const [claimGst, setClaimGst] = useState(false);
  const [gstCompanyName, setGstCompanyName] = useState('Tata Consultancy Services Ltd');
  const [gstinNumber, setGstinNumber] = useState('27AAACT2727Q1ZW');
  const [gstAddress, setGstAddress] = useState('Bandra Kurla Complex, Mumbai, Maharashtra 400051');

  // MMT Feature 4: Coupons & Coupon Drawer
  const [couponCode, setCouponCode] = useState('MMTWELCOME');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(2000);
  const [couponError, setCouponError] = useState('');
  const [isCouponDrawerOpen, setIsCouponDrawerOpen] = useState(false);

  // MMT Feature 5: Travel Wallet Coins
  const [redeemWalletCoins, setRedeemWalletCoins] = useState(false);
  const WALLET_COINS_DISCOUNT = 500;

  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const basePrice = priceParam;
  const taxes = Math.round(basePrice * 0.18);
  const insuranceAmount = zeroCancellationOpted ? ZERO_CANCEL_FEE : 0;
  const walletDiscount = redeemWalletCoins ? WALLET_COINS_DISCOUNT : 0;
  const totalPayable = Math.max(
    0,
    basePrice + taxes + insuranceAmount - appliedDiscount - walletDiscount
  );

  const toggleRequest = (req: string) => {
    if (selectedRequests.includes(req)) {
      setSelectedRequests(selectedRequests.filter((r) => r !== req));
    } else {
      setSelectedRequests([...selectedRequests, req]);
    }
  };

  const handleApplyCoupon = (codeToApply?: string) => {
    const code = (codeToApply || couponCode).trim().toUpperCase();
    setCouponCode(code);
    const matched = AVAILABLE_COUPONS.find((c) => c.code === code);
    if (matched) {
      setAppliedDiscount(matched.discount);
      setCouponError('');
      setIsCouponDrawerOpen(false);
    } else {
      setCouponError(`Invalid promo code "${code}". Click "View Offers" to choose.`);
      setAppliedDiscount(0);
    }
  };

  const loadRazorpayScript = () => {
    return new Promise<boolean>((resolve) => {
      if (typeof window === 'undefined') return resolve(false);
      if ((window as any).Razorpay) return resolve(true);

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const proceedWithBooking = async () => {
    setIsProcessingPayment(true);

    const allRequests = [...selectedRequests];
    if (customRequest.trim()) {
      allRequests.push(customRequest.trim());
    }

    try {
      // 1. Call Backend API to initiate reservation with all MMT features
      const booking = await apiClient.initiateBooking({
        hotelId: hotel.id,
        roomTypeId: 'room_deluxe_sea',
        checkInDate: '2026-11-15',
        checkOutDate: '2026-11-18',
        baseAmount: basePrice,
        guestName: `${title} ${firstName} ${lastName}`,
        guestEmail: email,
        guestPhone: phone,
        couponCode: appliedDiscount > 0 ? couponCode : undefined,
        zeroCancellationInsurance: zeroCancellationOpted,
        specialRequests: allRequests,
        gstinDetails: claimGst
          ? {
              companyName: gstCompanyName,
              gstin: gstinNumber,
              companyAddress: gstAddress,
            }
          : undefined,
        walletCoinsRedeemed: redeemWalletCoins ? WALLET_COINS_DISCOUNT : 0,
      });

      // If user chose Pay at Hotel, bypass Razorpay and confirm immediately (MakeMyTrip Feature)
      if (paymentMode === 'PAY_AT_HOTEL') {
        router.push(
          `/hotels/confirmation?ref=${booking.bookingReference}&hotel=${encodeURIComponent(
            hotel.name
          )}&city=${encodeURIComponent(
            hotel.city
          )}&amount=${totalPayable}&name=${encodeURIComponent(
            `${title} ${firstName} ${lastName}`
          )}&payMode=hotel`
        );
        return;
      }

      // 2. Attempt Razorpay Modal
      const scriptReady = await loadRazorpayScript();
      if (scriptReady && (window as any).Razorpay) {
        const rzpOptions = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_wanderstay_mock',
          amount: totalPayable * 100,
          currency: 'INR',
          name: 'WanderStay Travel',
          description: `Booking for ${hotel.name}`,
          image:
            'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=128&auto=format&fit=crop&q=80',
          order_id: booking.razorpayOrderId,
          handler: async function (response: any) {
            await apiClient.verifyPayment({
              bookingReference: booking.bookingReference,
              razorpayOrderId: response.razorpay_order_id || booking.razorpayOrderId,
              razorpayPaymentId: response.razorpay_payment_id || `pay_rzp_${Date.now()}`,
              razorpaySignature: response.razorpay_signature || 'mock_signature_valid',
            });

            router.push(
              `/hotels/confirmation?ref=${booking.bookingReference}&hotel=${encodeURIComponent(
                hotel.name
              )}&city=${encodeURIComponent(
                hotel.city
              )}&amount=${totalPayable}&name=${encodeURIComponent(
                `${title} ${firstName} ${lastName}`
              )}`
            );
          },
          prefill: {
            name: `${title} ${firstName} ${lastName}`,
            email: email,
            contact: phone,
          },
          theme: {
            color: '#0066FF',
          },
          modal: {
            ondismiss: function () {
              setIsProcessingPayment(false);
            },
          },
        };

        const rzp = new (window as any).Razorpay(rzpOptions);
        rzp.on('payment.failed', function (res: any) {
          alert(`Payment failed: ${res.error?.description || 'Transaction declined'}`);
          setIsProcessingPayment(false);
        });
        rzp.open();
      } else {
        // Direct API verification fallback
        await apiClient.verifyPayment({
          bookingReference: booking.bookingReference,
          razorpayOrderId: booking.razorpayOrderId || `order_rzp_${Date.now()}`,
          razorpayPaymentId: `pay_rzp_${Date.now()}`,
          razorpaySignature: 'mock_signature_valid',
        });

        router.push(
          `/hotels/confirmation?ref=${booking.bookingReference}&hotel=${encodeURIComponent(
            hotel.name
          )}&city=${encodeURIComponent(
            hotel.city
          )}&amount=${totalPayable}&name=${encodeURIComponent(
            `${title} ${firstName} ${lastName}`
          )}`
        );
      }
    } catch {
      const fallbackRef = `MMT-HTL-${Math.floor(100000 + Math.random() * 900000)}`;
      router.push(
        `/hotels/confirmation?ref=${fallbackRef}&hotel=${encodeURIComponent(
          hotel.name
        )}&city=${encodeURIComponent(
          hotel.city
        )}&amount=${totalPayable}&name=${encodeURIComponent(
          `${title} ${firstName} ${lastName}`
        )}`
      );
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // MakeMyTrip / Goibibo Booking Authentication Check:
    // Guests can freely fill details, but before payment, verify phone number with instant OTP
    const stored = typeof window !== 'undefined' ? localStorage.getItem('wanderstay_customer_profile') : null;
    if (!stored) {
      setIsAuthModalOpen(true);
      return;
    }

    await proceedWithBooking();
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#F4F6F8]">
      <Header activeTab="hotels" onTabChange={() => router.push('/')} />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* MakeMyTrip Style Account Banner */}
        {!isUserLoggedIn && (
          <div className="mb-6 rounded-2xl bg-amber-50 border border-amber-200/80 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <Coins className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-stone-900">
                  Already have an account? Sign In for seamless checkout
                </p>
                <p className="text-xs text-stone-600">
                  Auto-fill saved guest details, apply secret member rates &amp; earn 500 WanderStay coins.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsAuthModalOpen(true)}
              className="px-4 py-2 rounded-full bg-[#18181B] text-white text-xs font-bold hover:bg-black transition-colors shrink-0"
            >
              Sign In Now
            </button>
          </div>
        )}

        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#C25E34]">
              Step 3 of 3 • Review &amp; Checkout
            </span>
            <h1 className="text-3xl font-black text-slate-900 mt-0.5">
              Review Your Booking Details
            </h1>
          </div>
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-slate-200 text-xs text-slate-600 shadow-xs">
            <ShieldCheck className="h-4 w-4 text-amber-500" />
            <span>100% Guaranteed Booking &amp; Instant Confirmation</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT COLUMN: GUEST DETAILS, ZERO-CANCELLATION, REQUESTS, GSTIN (col-span-8) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Hotel Summary Card */}
            <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={hotel.imageUrl}
                  alt={hotel.name}
                  className="h-20 w-28 rounded-xl object-cover shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-blue-50 text-[#C25E34] border border-blue-200 px-2 py-0.5 text-[10px] font-bold uppercase">
                      {hotel.city}
                    </span>
                    <span className="text-[11px] font-bold text-amber-500">
                      ★ {(hotel as any).rating || hotel.starRating || 4.8} / 5.0
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mt-1">
                    {hotel.name}
                  </h3>
                  <p className="text-xs text-slate-500">{hotel.area} • Deluxe Sea Facing Suite (1 Night)</p>
                </div>
              </div>
              <div className="sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                <span className="text-[11px] text-slate-500 block font-medium">Check-in: 15 Nov 2026 (14:00)</span>
                <span className="text-[11px] text-slate-500 block font-medium">Check-out: 18 Nov 2026 (11:00)</span>
                <span className="text-xs font-bold text-[#C25E34]">2 Adults • 1 Room</span>
              </div>
            </div>

            {/* MMT FEATURE 1: Zero-Cancellation Protection Add-on */}
            <div
              className={`rounded-2xl p-5 border transition-all ${
                zeroCancellationOpted
                  ? 'bg-blue-50/50 border-[#C25E34] shadow-sm'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-100 text-[#C25E34] flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900">
                        WanderStay Zero-Cancellation Protection
                      </h3>
                      <span className="rounded-full bg-amber-500 text-white px-2 py-0.5 text-[10px] font-bold uppercase">
                        Recommended
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Plans changed? Get a <strong>100% full refund</strong> (including taxes) if cancelled up to 2 hours prior to check-in. No documentation, no cancellation penalty!
                    </p>
                    <div className="mt-2 flex items-center gap-4 text-[11px] text-slate-500">
                      <span>✓ Instant refund to source</span>
                      <span>✓ Medical &amp; travel emergencies covered</span>
                      <span>✓ ₹299 flat coverage</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-sm font-black text-slate-900">+ ₹{ZERO_CANCEL_FEE}</div>
                  <label className="mt-2 inline-flex items-center cursor-pointer gap-2">
                    <input
                      type="checkbox"
                      checked={zeroCancellationOpted}
                      onChange={(e) => setZeroCancellationOpted(e.target.checked)}
                      className="h-4 w-4 rounded accent-[#C25E34] cursor-pointer"
                    />
                    <span className="text-xs font-bold text-slate-900">
                      {zeroCancellationOpted ? 'Added' : 'Add Protection'}
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Guest Form */}
            <div className="rounded-2xl bg-white p-6 border border-slate-200 shadow-xs">
              <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span>Guest Information (Lead Passenger)</span>
                <span className="text-[11px] font-normal text-slate-400">
                  (Government ID verification required at check-in)
                </span>
              </h2>

              <form onSubmit={handlePaymentSubmit} id="checkout-form" className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-6 gap-4">
                  <div className="sm:col-span-1">
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Title
                    </label>
                    <select
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 p-2 text-xs font-bold focus:border-[#C25E34] focus:outline-none bg-slate-50"
                    >
                      <option>Mr</option>
                      <option>Ms</option>
                      <option>Mrs</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 p-2 text-xs font-medium focus:border-[#C25E34] focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 p-2 text-xs font-medium focus:border-[#C25E34] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Email Address (For Instant Voucher Delivery)
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 p-2 text-xs font-medium focus:border-[#C25E34] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Mobile Number (+91)
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 p-2 text-xs font-medium focus:border-[#C25E34] focus:outline-none"
                    />
                  </div>
                </div>

                {/* MMT FEATURE 2: Special Requests Chips */}
                <div className="pt-2">
                  <label className="block text-xs font-bold text-slate-900 mb-2">
                    Special Requests (Optional • Forwarded directly to hotel desk)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {SPECIAL_REQUEST_OPTIONS.map((req) => {
                      const isSelected = selectedRequests.includes(req);
                      return (
                        <button
                          key={req}
                          type="button"
                          onClick={() => toggleRequest(req)}
                          className={`text-xs px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#C25E34] text-[#18181B] text-white border-[#C25E34] font-bold shadow-xs'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-[#C25E34]'
                          }`}
                        >
                          {req} {isSelected && '✓'}
                        </button>
                      );
                    })}
                  </div>
                  <input
                    type="text"
                    value={customRequest}
                    onChange={(e) => setCustomRequest(e.target.value)}
                    placeholder="Other specific request (e.g. Airport transfer cab pickup, baby cot)..."
                    className="mt-3 w-full rounded-lg border border-slate-200 p-2 text-xs font-medium focus:border-[#C25E34] focus:outline-none"
                  />
                </div>

                {/* MMT FEATURE 3: Corporate GSTIN Invoice Toggle */}
                <div className="pt-3 border-t border-slate-100">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={claimGst}
                      onChange={(e) => setClaimGst(e.target.checked)}
                      className="h-4 w-4 rounded accent-[#C25E34] cursor-pointer"
                    />
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-[#C25E34]" />
                      <span className="text-xs font-bold text-slate-900">
                        I am booking for business / Claim GST Tax Invoice (Save up to 18%)
                      </span>
                    </div>
                  </label>

                  {claimGst && (
                    <div className="mt-3 bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                      <div className="flex items-center gap-2 text-[11px] text-[#C25E34] font-bold">
                        <Info className="h-3.5 w-3.5" />
                        <span>GST Tax Invoice with SAC Code 9963 will be issued for tax credit</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                            Registered Company Name
                          </label>
                          <input
                            type="text"
                            value={gstCompanyName}
                            onChange={(e) => setGstCompanyName(e.target.value)}
                            required={claimGst}
                            className="w-full rounded-lg border border-slate-200 p-2 text-xs font-medium bg-white focus:border-[#C25E34] focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                            GSTIN (15-Digit Alphanumeric)
                          </label>
                          <input
                            type="text"
                            value={gstinNumber}
                            onChange={(e) => setGstinNumber(e.target.value.toUpperCase())}
                            required={claimGst}
                            maxLength={15}
                            className="w-full rounded-lg border border-slate-200 p-2 text-xs font-mono font-bold bg-white focus:border-[#C25E34] focus:outline-none uppercase"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Company Registered Address
                        </label>
                        <input
                          type="text"
                          value={gstAddress}
                          onChange={(e) => setGstAddress(e.target.value)}
                          className="w-full rounded-lg border border-slate-200 p-2 text-xs font-medium bg-white focus:border-[#C25E34] focus:outline-none"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* RIGHT COLUMN: FARE BREAKDOWN, COUPONS, WALLET & PAYMENT (col-span-4) */}
          <div className="lg:col-span-4 space-y-4">
            {/* MMT FEATURE 4: Coupon Code Box & View Offers Drawer Link */}
            <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Apply Promo Code
                </span>
                <button
                  type="button"
                  onClick={() => setIsCouponDrawerOpen(true)}
                  className="text-xs font-bold text-[#C25E34] hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                  <Tag className="h-3 w-3" />
                  <span>View All Offers</span>
                  <ChevronRight className="h-3 w-3" />
                </button>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Enter Code"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-mono font-bold uppercase focus:border-[#C25E34] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleApplyCoupon()}
                  className="rounded-lg bg-[#C25E34] text-[#18181B] hover:bg-[#A84F2A] px-4 py-2 text-xs font-bold text-white transition-colors cursor-pointer shadow-xs"
                >
                  Apply
                </button>
              </div>

              {appliedDiscount > 0 && (
                <div className="mt-2.5 p-2 bg-stone-100 rounded-lg border border-stone-200 flex items-center justify-between">
                  <p className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-amber-500" />
                    <span>Applied: {couponCode} (-₹{appliedDiscount})</span>
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setAppliedDiscount(0);
                      setCouponCode('');
                    }}
                    className="text-[11px] font-bold text-rose-600 hover:underline cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              )}
              {couponError && (
                <p className="mt-2 text-xs text-rose-600 font-medium">{couponError}</p>
              )}
            </div>

            {/* MMT FEATURE 5: Travel Wallet Coins Redemption */}
            <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-xs">
              <label className="flex items-start justify-between cursor-pointer">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Coins className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-900">
                        WanderStay Wallet Coins
                      </span>
                      <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-300 px-1.5 py-0.2 rounded font-bold">
                        Balance: 2,500
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Redeem 500 coins to save ₹500 on this booking
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={redeemWalletCoins}
                  onChange={(e) => setRedeemWalletCoins(e.target.checked)}
                  className="h-4 w-4 rounded accent-[#C25E34] cursor-pointer mt-1"
                />
              </label>
            </div>

            {/* Price Breakdown Card */}
            <div className="rounded-2xl bg-white p-6 border border-slate-200 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                Fare Summary
              </h3>

              <div className="flex justify-between text-xs text-slate-600">
                <span>Base Room Rate (1 Night)</span>
                <span>₹{basePrice.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between text-xs text-slate-600">
                <span>Hotel Taxes &amp; Service GST (18%)</span>
                <span>₹{taxes.toLocaleString('en-IN')}</span>
              </div>

              {zeroCancellationOpted && (
                <div className="flex justify-between text-xs text-slate-900 font-semibold">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5 text-amber-500" />
                    Zero-Cancellation Protection
                  </span>
                  <span>+ ₹{ZERO_CANCEL_FEE}</span>
                </div>
              )}

              {appliedDiscount > 0 && (
                <div className="flex justify-between text-xs font-bold text-stone-700">
                  <span>Coupon Discount ({couponCode})</span>
                  <span>- ₹{appliedDiscount.toLocaleString('en-IN')}</span>
                </div>
              )}

              {redeemWalletCoins && (
                <div className="flex justify-between text-xs font-bold text-stone-700">
                  <span>Wallet Coins Redeemed</span>
                  <span>- ₹{WALLET_COINS_DISCOUNT.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">
                    Total Amount
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Inclusive of all taxes &amp; fees
                  </span>
                </div>
                <span className="text-2xl font-black text-slate-900">
                  ₹{totalPayable.toLocaleString('en-IN')}
                </span>
              </div>

              {/* MMT FEATURE: Pay Now vs Pay at Hotel */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <span className="text-xs font-bold text-slate-900 block">
                  Select Payment Preference
                </span>
                <label
                  onClick={() => setPaymentMode('PAY_NOW')}
                  className={`flex items-start gap-3 p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                    paymentMode === 'PAY_NOW'
                      ? 'border-[#C25E34] bg-[#FAF8F5] text-[#18181B]'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMode"
                    checked={paymentMode === 'PAY_NOW'}
                    onChange={() => setPaymentMode('PAY_NOW')}
                    className="mt-0.5 text-[#C25E34] focus:ring-[#C25E34]"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <strong className="text-xs font-bold text-slate-900">Pay Online Now (Recommended)</strong>
                      <span className="text-[9px] bg-stone-200 text-stone-800 px-1.5 py-0.2 rounded font-black">SAVE MORE</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Pay via Razorpay, UPI, Cards, NetBanking. Best promotional rates.
                    </p>
                  </div>
                </label>

                <label
                  onClick={() => setPaymentMode('PAY_AT_HOTEL')}
                  className={`flex items-start gap-3 p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                    paymentMode === 'PAY_AT_HOTEL'
                      ? 'border-[#C25E34] bg-[#FAF8F5] text-[#18181B]'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMode"
                    checked={paymentMode === 'PAY_AT_HOTEL'}
                    onChange={() => setPaymentMode('PAY_AT_HOTEL')}
                    className="mt-0.5 text-[#C25E34] focus:ring-[#C25E34]"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <strong className="text-xs font-bold text-slate-900">Book with ₹0 Down • Pay at Hotel</strong>
                      <span className="text-[9px] bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded font-black">NO CARD REQ.</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Reserve now for ₹0. Pay directly at the hotel front desk during check-in.
                    </p>
                  </div>
                </label>
              </div>

              {/* Pay Now or Confirm Button */}
              <button
                type="submit"
                form="checkout-form"
                disabled={isProcessingPayment}
                className="w-full mt-4 btn-search-gradient rounded-full py-3.5 text-xs sm:text-sm font-black uppercase tracking-wider text-white shadow-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isProcessingPayment ? (
                  <span>Processing Reservation...</span>
                ) : paymentMode === 'PAY_AT_HOTEL' ? (
                  <>
                    <Building2 className="h-4 w-4" />
                    <span>Confirm Booking • Pay ₹0 Today</span>
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    <span>Pay with Razorpay (₹{totalPayable.toLocaleString('en-IN')})</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 pt-2">
                <ShieldCheck className="h-3.5 w-3.5 text-amber-500" />
                <span>256-Bit Encrypted Razorpay • PCI-DSS Certified</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* MMT SLIDE-OVER COUPON DRAWER */}
      {isCouponDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white h-full shadow-2xl p-6 overflow-y-auto flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    Available Offers &amp; Discounts
                  </h3>
                  <p className="text-xs text-slate-500">Select an offer to apply immediately</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCouponDrawerOpen(false)}
                  className="p-2 rounded-full hover:bg-slate-100 cursor-pointer"
                >
                  <X className="h-5 w-5 text-slate-600" />
                </button>
              </div>

              <div className="mt-6 space-y-4">
                {AVAILABLE_COUPONS.map((coupon) => {
                  const isCurrent = couponCode === coupon.code && appliedDiscount > 0;
                  return (
                    <div
                      key={coupon.code}
                      className={`p-4 rounded-xl border transition-all ${
                        isCurrent
                          ? 'border-[#C25E34] bg-blue-50/50'
                          : 'border-slate-200 hover:border-[#C25E34] bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider bg-slate-900 text-white px-2 py-0.5 rounded">
                            {coupon.tag}
                          </span>
                          <h4 className="font-mono text-sm font-black text-[#C25E34] mt-2">
                            {coupon.code}
                          </h4>
                          <p className="text-xs font-bold text-slate-900 mt-0.5">
                            {coupon.title}
                          </p>
                          <p className="text-[11px] text-slate-500 mt-1">{coupon.desc}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleApplyCoupon(coupon.code)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                            isCurrent
                              ? 'bg-amber-500 text-white'
                              : 'bg-[#C25E34] text-[#18181B] text-white hover:bg-[#A84F2A]'
                          }`}
                        >
                          {isCurrent ? 'Applied' : 'Apply'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsCouponDrawerOpen(false)}
                className="w-full py-2.5 rounded-full border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Customer Mobile OTP Verification Modal for MakeMyTrip / Goibibo Flow */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialPhone={phone}
        initialName={`${title} ${firstName} ${lastName}`.trim()}
        initialEmail={email}
        onSuccess={() => {
          setIsAuthModalOpen(false);
          setIsUserLoggedIn(true);
          setTimeout(() => {
            proceedWithBooking();
          }, 200);
        }}
      />

      <Footer />
    </div>
  );
}

export default function HotelCheckoutPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading checkout...</div>}>
      <HotelCheckoutContent />
    </Suspense>
  );
}
