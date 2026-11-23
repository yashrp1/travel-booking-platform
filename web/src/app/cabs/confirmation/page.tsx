'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import {
  CheckCircle,
  Car,
  Clock,
  MapPin,
  ShieldCheck,
  UserCheck,
  Printer,
  Sparkles,
  Phone,
  MessageSquare,
  Navigation,
  Share2,
  AlertTriangle,
  Radio,
} from 'lucide-react';

function CabConfirmationContent() {
  const searchParams = useSearchParams();

  const ref = searchParams.get('ref') || 'MMT-CAB-782190';
  const cabName = searchParams.get('cab') || 'Dzire, Etios or similar';
  const category = searchParams.get('category') || 'SEDAN';
  const fromCity = searchParams.get('from') || 'New Delhi';
  const toCity = searchParams.get('to') || 'Agra';
  const fare = searchParams.get('fare') || '3420';
  const date = searchParams.get('date') || '2026-11-12';
  const time = searchParams.get('time') || '07:00 AM';

  const [etaMinutes, setEtaMinutes] = useState(14);
  const [distanceKm, setDistanceKm] = useState(4.2);
  const [copiedLink, setCopiedLink] = useState(false);
  const [sosActive, setSosActive] = useState(false);

  // Simulated GPS movement
  useEffect(() => {
    const timer = setInterval(() => {
      setEtaMinutes((prev) => (prev > 2 ? prev - 1 : 2));
      setDistanceKm((prev) => (prev > 0.6 ? Number((prev - 0.3).toFixed(1)) : 0.5));
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleShareTrip = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  const handleCallDriver = () => {
    alert('Connecting to Chauffeur Vikram Singh via secure masked call line (+91 98765 43210)...');
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#F4F6F8]">
      <Header activeTab="cabs" onTabChange={() => {}} />

      <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
        <div className="rounded-3xl bg-white border border-[#E2E8F0] shadow-xl overflow-hidden">
          {/* Luxury Top Ribbon */}
          <div className="bg-gradient-to-r from-[#0F172A] via-[#322A27] to-[#0066FF] p-6 text-white text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
                <CheckCircle className="h-8 w-8 text-[#94A3B8]" />
              </div>
              <div>
                <span className="text-xs uppercase font-extrabold tracking-widest text-[#94A3B8]">
                  RESERVATION CONFIRMED • DOORSTEP PICKUP
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold font-black tracking-wide">
                  Cab Booking Confirmed!
                </h1>
              </div>
            </div>

            <div className="text-center sm:text-right bg-white/10 rounded-xl px-4 py-2 border border-white/20">
              <span className="text-[10px] uppercase font-bold text-[#94A3B8] block">
                Booking Reference ID
              </span>
              <strong className="text-sm sm:text-base font-mono tracking-wider text-white">
                {ref}
              </strong>
            </div>
          </div>

          {/* Details Body */}
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-[#E2E8F0] gap-4">
              <div>
                <span className="rounded bg-[#EFF6FF] text-[#C25E34] border border-[#94A3B8] font-bold px-2 py-0.5 text-xs uppercase tracking-wider">
                  {category}
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold font-black text-[#0F172A] mt-1">
                  {cabName}
                </h2>
                <p className="flex items-center gap-1.5 text-xs text-[#877B76] mt-1">
                  <MapPin className="h-4 w-4 text-[#C25E34]" />
                  <span>
                    Route: <strong className="text-[#0F172A]">{fromCity}</strong> to{' '}
                    <strong className="text-[#0F172A]">{toCity}</strong>
                  </span>
                </p>
              </div>

              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 rounded-full border border-[#94A3B8] px-4 py-2 text-xs font-bold text-[#0F172A] hover:bg-[#EFF6FF] cursor-pointer transition-colors"
              >
                <Printer className="h-4 w-4 text-[#877B76]" />
                <span>Print Receipt</span>
              </button>
            </div>

            {/* MakeMyTrip Feature: Secure 4-Digit Trip Start OTP Widget */}
            <div className="bg-[#EFF6FF] border-2 border-[#C25E34]/30 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-center sm:text-left">
                <div className="h-12 w-12 rounded-full bg-[#C25E34] text-[#18181B] text-white flex items-center justify-center shrink-0">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#C25E34] block">
                    Security Verification
                  </span>
                  <h3 className="text-sm font-bold text-[#0F172A]">
                    Trip Start Security OTP
                  </h3>
                  <p className="text-xs text-[#574E4A] mt-0.5">
                    Share this code with chauffeur only when you board the verified cab
                  </p>
                </div>
              </div>
              <div className="bg-white border border-[#94A3B8] px-6 py-2.5 rounded-xl shadow-xs text-center shrink-0">
                <span className="text-[10px] font-bold text-[#877B76] uppercase tracking-wider block">
                  Trip Start OTP
                </span>
                <span className="font-mono text-2xl font-black text-[#0F172A] tracking-widest">
                  {Math.floor(1000 + (ref.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % 9000))}
                </span>
              </div>
            </div>

            {/* LIVE GPS CHAUFFEUR TRACKER SIMULATION (MakeMyTrip Feature) */}
            <div className="rounded-2xl border-2 border-[#C25E34]/40 bg-gradient-to-br from-[#18181B] to-[#18181B] text-white p-6 shadow-xl space-y-5">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-white/10 pb-4">
                <div className="flex items-center gap-2.5">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C25E34] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-[#C25E34]"></span>
                  </span>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-wider text-white flex items-center gap-2">
                      <span>Live Chauffeur GPS Tracking</span>
                      <span className="bg-[#C25E34]/20 text-[#C25E34] border border-[#C25E34]/40 px-2 py-0.2 rounded text-[10px] font-mono">
                        CONNECTED
                      </span>
                    </h3>
                    <p className="text-xs text-stone-200/70">
                      Chauffeur assigned and en route to {fromCity} pickup point
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleShareTrip}
                    className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Share2 className="h-3.5 w-3.5" />
                    <span>{copiedLink ? 'Copied Link!' : 'Share Live Trip'}</span>
                  </button>
                  <button
                    onClick={() => setSosActive(!sosActive)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                      sosActive
                        ? 'bg-rose-600 text-white animate-pulse'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-600 hover:text-white'
                    }`}
                  >
                    <AlertTriangle className="h-3.5 w-3.5" />
                    <span>{sosActive ? 'SOS Alerted' : '24x7 SOS'}</span>
                  </button>
                </div>
              </div>

              {/* Animated Map Simulation Canvas */}
              <div className="relative h-44 rounded-xl bg-[#082F2C] overflow-hidden border border-[#0F443F] p-4 flex flex-col justify-between">
                {/* Simulated Grid Matrix Background */}
                <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#C25E34_1px,transparent_1px)] [background-size:20px_20px]"></div>

                {/* Simulated Highway Path */}
                <div className="absolute inset-x-8 top-1/2 h-1 bg-gradient-to-r from-[#C25E34] via-cyan-400 to-white/30 transform -translate-y-1/2"></div>

                {/* Moving Vehicle Pin */}
                <div className="absolute top-1/2 left-2/5 transform -translate-y-1/2 -translate-x-1/2 flex flex-col items-center animate-pulse">
                  <div className="h-9 w-9 rounded-full bg-[#C25E34] text-[#18181B] flex items-center justify-center shadow-lg shadow-[#C25E34]/50 font-black">
                    <Car className="h-5 w-5" />
                  </div>
                  <span className="mt-1 bg-black/80 px-2 py-0.5 rounded text-[10px] font-bold text-[#C25E34] whitespace-nowrap border border-[#C25E34]/40">
                    Cab: DL 01 AB 8899
                  </span>
                </div>

                {/* Pickup Destination Pin */}
                <div className="absolute top-1/2 right-12 transform -translate-y-1/2 flex flex-col items-center">
                  <div className="h-8 w-8 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-md">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <span className="mt-1 bg-black/80 px-2 py-0.5 rounded text-[10px] font-bold text-white whitespace-nowrap">
                    Your Pickup Point
                  </span>
                </div>

                {/* Top Status Banner Overlay */}
                <div className="relative z-10 flex items-center justify-between text-xs bg-[#18181B]/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
                  <span className="text-stone-200/80">
                    ETA: <strong className="text-[#C25E34] font-black">{etaMinutes} mins</strong> ({distanceKm} km away)
                  </span>
                  <span className="text-[11px] text-cyan-300 font-bold">● Speed: 42 km/h</span>
                </div>

                {/* Bottom Route Bar */}
                <div className="relative z-10 flex items-center justify-between text-[11px] text-slate-300 bg-[#18181B]/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
                  <span>From: {fromCity} Central</span>
                  <span>&rarr;</span>
                  <span>Destination: {toCity} Highway Expressway</span>
                </div>
              </div>

              {/* Chauffeur Contact & Vehicle Verification Card */}
              <div className="bg-[#082F2C]/90 rounded-xl p-4 border border-[#0F443F] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-[#C25E34] text-[#18181B] flex items-center justify-center font-black text-base shadow-sm">
                    VS
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="text-sm font-bold text-white">Vikram Singh</strong>
                      <span className="bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[10px] font-black px-1.5 py-0.2 rounded">
                        ★ 4.9 (3,420 trips)
                      </span>
                    </div>
                    <p className="text-xs text-stone-200/70 mt-0.5">
                      White {category} • Reg: <strong className="text-white font-mono">DL 01 AB 8899</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={handleCallDriver}
                    className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-[#C25E34] hover:bg-[#A84F2A] text-[#18181B] font-black text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    <span>Call Driver</span>
                  </button>
                  <a
                    href="https://wa.me/919876543210"
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-white/20"
                  >
                    <MessageSquare className="h-3.5 w-3.5 text-emerald-400" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Trip Timeline Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#F8FAFC] border border-[#E2E8F0] p-4 rounded-2xl text-xs">
              <div>
                <span className="text-[#877B76] font-bold uppercase tracking-wider block text-[10px]">
                  Pickup Schedule
                </span>
                <strong className="text-[#0F172A] text-sm block mt-0.5">
                  {date}
                </strong>
                <span className="text-[#C25E34] font-bold text-[11px]">
                  Scheduled at {time}
                </span>
              </div>

              <div>
                <span className="text-[#877B76] font-bold uppercase tracking-wider block text-[10px]">
                  Chauffeur Allocation
                </span>
                <strong className="text-[#4D6B53] text-sm block mt-0.5 flex items-center gap-1">
                  <UserCheck className="h-4 w-4" /> Driver Queued (4.9★)
                </strong>
                <span className="text-[#877B76] text-[11px]">SMS sent 2 hrs prior</span>
              </div>

              <div>
                <span className="text-[#877B76] font-bold uppercase tracking-wider block text-[10px]">
                  Total Estimated Fare
                </span>
                <strong className="text-[#0F172A] text-base block mt-0.5 font-sans font-black">
                  ₹{Number(fare).toLocaleString('en-IN')}
                </strong>
                <span className="text-[#877B76] text-[11px]">Includes Driver Allowance</span>
              </div>
            </div>

            {/* Chauffeur Safety Policy & Sanitization Checkmarks */}
            <div className="rounded-xl border border-[#CBD5E1] bg-white p-4 space-y-3 text-xs text-[#0F172A]">
              <h3 className="font-bold flex items-center gap-1.5 text-sm text-[#C25E34]">
                <ShieldCheck className="h-4 w-4" /> WanderStay Chauffeur Assurance Checklist
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[#574E4A]">
                <div className="flex items-center gap-2">
                  <span className="text-[#4D6B53] font-bold">✓</span>
                  <span>Police-verified commercial chauffeur license</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#4D6B53] font-bold">✓</span>
                  <span>Vehicle sanitized with cabin air purifier</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#4D6B53] font-bold">✓</span>
                  <span>Free 45-minute flight/train delay waiting buffer</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#4D6B53] font-bold">✓</span>
                  <span>24x7 SOS emergency roadside assistance</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#E2E8F0]">
              <span className="text-xs text-[#877B76]">
                Need to modify pickup timing? Call our 24x7 desk at <strong>1800-102-8747</strong>
              </span>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Link
                  href="/account/bookings"
                  className="w-full sm:w-auto px-5 py-2.5 rounded-full border border-[#0F172A] text-xs font-bold text-[#0F172A] hover:bg-neutral-50 text-center"
                >
                  My Trips &amp; Invoices
                </Link>
                <Link
                  href="/"
                  className="w-full sm:w-auto btn-search-gradient rounded-full px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white text-center cursor-pointer shadow-md"
                >
                  Back to Homepage
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function CabConfirmationPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading voucher...</div>}>
      <CabConfirmationContent />
    </Suspense>
  );
}
