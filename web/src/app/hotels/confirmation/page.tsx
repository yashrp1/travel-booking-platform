'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import {
  CheckCircle,
  Download,
  Share2,
  Calendar,
  MapPin,
  User,
  ShieldCheck,
  Building2,
  Printer,
  Sparkles,
} from 'lucide-react';

function HotelConfirmationContent() {
  const searchParams = useSearchParams();

  const ref = searchParams.get('ref') || 'MMT-HTL-482910';
  const hotel = searchParams.get('hotel') || 'Taj Fort Aguada Resort & Spa';
  const city = searchParams.get('city') || 'Goa';
  const amount = searchParams.get('amount') || '15110';
  const guestName = searchParams.get('name') || 'Guest';
  const isPayAtHotel = searchParams.get('payMode') === 'hotel';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#F4F6F8]">
      <Header activeTab="hotels" onTabChange={() => {}} />

      <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
        {/* Success Card */}
        <div className="rounded-3xl bg-white border border-[#E2E8F0] shadow-xl overflow-hidden">
          {/* Luxury Top Ribbon */}
          <div className="bg-gradient-to-r from-[#18181B] via-[#27272A] to-[#C25E34] p-6 text-white text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
                <CheckCircle className="h-8 w-8 text-amber-400" />
              </div>
              <div>
                <span className="text-xs uppercase font-extrabold tracking-widest text-amber-300">
                  {isPayAtHotel
                    ? 'RESERVATION CONFIRMED • PAY AT PROPERTY (₹0 TODAY)'
                    : 'PAYMENT SUCCESSFUL • RAZORPAY CONFIRMED'}
                </span>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  Hotel Booking Confirmed!
                </h1>
              </div>
            </div>

            <div className="text-center sm:text-right bg-white/10 rounded-xl px-4 py-2 border border-white/20">
              <span className="text-[10px] uppercase font-bold text-stone-300 block">
                Booking Reference ID
              </span>
              <strong className="text-sm sm:text-base font-mono tracking-wider text-white">
                {ref}
              </strong>
            </div>
          </div>

          {/* Voucher Details Body */}
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-stone-200 gap-4">
              <div>
                <span className="rounded bg-orange-50 text-[#C25E34] border border-orange-200 font-bold px-2 py-0.5 text-xs uppercase tracking-wider">
                  {city} Property
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold font-black text-stone-900 mt-1">
                  {hotel}
                </h2>
                <p className="flex items-center gap-1.5 text-xs text-stone-500 mt-1">
                  <MapPin className="h-4 w-4 text-[#C25E34]" />
                  <span>Sinquerim, Candolim Beach, Goa</span>
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 rounded-full border border-[#94A3B8] px-4 py-2 text-xs font-bold text-[#0F172A] hover:bg-[#EFF6FF] cursor-pointer transition-colors"
                >
                  <Printer className="h-4 w-4 text-[#877B76]" />
                  <span>Print Voucher</span>
                </button>
              </div>
            </div>

            {/* Stay Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#F8FAFC] border border-[#E2E8F0] p-4 rounded-2xl text-xs">
              <div>
                <span className="text-[#877B76] font-bold uppercase tracking-wider block text-[10px]">
                  Check-In
                </span>
                <strong className="text-[#0F172A] text-sm block mt-0.5">
                  Sun, 15 Nov 2026
                </strong>
                <span className="text-[#877B76] text-[11px]">From 02:00 PM</span>
              </div>

              <div>
                <span className="text-[#877B76] font-bold uppercase tracking-wider block text-[10px]">
                  Check-Out
                </span>
                <strong className="text-[#0F172A] text-sm block mt-0.5">
                  Wed, 18 Nov 2026
                </strong>
                <span className="text-[#877B76] text-[11px]">Until 11:00 AM</span>
              </div>

              <div>
                <span className="text-[#877B76] font-bold uppercase tracking-wider block text-[10px]">
                  Lead Guest
                </span>
                <strong className="text-[#0F172A] text-sm block mt-0.5">
                  {guestName}
                </strong>
                <span className="text-[#877B76] text-[11px]">1 Room, 2 Adults</span>
              </div>
            </div>

            {/* Financial Ledger Breakdown */}
            <div className="rounded-xl border border-[#E2E8F0] p-4 space-y-2 text-xs">
              <h3 className="font-bold text-[#0F172A] uppercase tracking-wider mb-2">Payment Breakdown</h3>
              <div className="flex justify-between text-[#574E4A]">
                <span>Room Charges &amp; Base Fare</span>
                <span>₹{Number(amount) - Math.round(Number(amount) * 0.15)}</span>
              </div>
              <div className="flex justify-between text-[#574E4A]">
                <span>Taxes &amp; Service GST</span>
                <span>₹{Math.round(Number(amount) * 0.15)}</span>
              </div>
              <div className="pt-2 border-t border-[#E2E8F0] flex justify-between font-black text-sm text-[#0F172A]">
                <span>Total Paid via Razorpay</span>
                <span className="text-base font-sans font-black">₹{Number(amount).toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Post-booking Next Steps */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
              <div className="flex items-center gap-2 text-xs text-[#877B76]">
                <ShieldCheck className="h-4 w-4 text-[#4D6B53]" />
                <span>Instant confirmation SMS and WhatsApp voucher dispatched.</span>
              </div>

              <Link
                href="/"
                className="w-full sm:w-auto btn-search-gradient rounded-full px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white text-center cursor-pointer shadow-md"
              >
                Return to Homepage
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function HotelConfirmationPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading voucher...</div>}>
      <HotelConfirmationContent />
    </Suspense>
  );
}
