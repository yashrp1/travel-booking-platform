'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Hotel,
  Car,
  TrendingUp,
  Plus,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowUpRight,
  MapPin,
  Star,
  X,
  Edit3,
  ShieldCheck,
  AlertCircle,
  Briefcase,
  Users,
  Settings,
  LogOut,
  ChevronRight,
  Layers,
  Calendar,
} from 'lucide-react';
import { apiClient } from '@/lib/api-client';

export default function UnifiedPartnerPortal() {
  const [partner, setPartner] = useState<any>(null);
  const [authMode, setAuthMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');

  // Auth form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [regData, setRegData] = useState({
    businessName: '',
    contactName: '',
    email: '',
    phone: '',
    password: '',
    services: ['HOTELS'] as ('HOTELS' | 'CABS')[],
  });
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);

  // Portal view & tabs
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'HOTELS' | 'CABS' | 'BOOKINGS' | 'CALENDAR'>('OVERVIEW');
  const [overview, setOverview] = useState<any>(null);
  const [properties, setProperties] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);

  // MMT IngoMMT Parity: 90-Day Calendar State
  const [selectedCalendarPropId, setSelectedCalendarPropId] = useState<string>('');
  const [calendarOverrides, setCalendarOverrides] = useState<Record<string, { blocked: boolean; surgePct?: number; customPrice?: number }>>({});

  // Modals
  const [isPropertyModalOpen, setIsPropertyModalOpen] = useState(false);
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [isServicesModalOpen, setIsServicesModalOpen] = useState(false);

  // Hotel Listing Form
  const [hotelForm, setHotelForm] = useState({
    name: '',
    propertyType: 'HOTEL',
    city: '',
    address: '',
    starRating: 4,
    basePrice: 0,
    discountedPrice: 0,
    amenities: '',
    imageUrl: '',
  });

  // Cab Listing Form
  const [cabForm, setCabForm] = useState({
    category: 'SEDAN',
    name: '',
    modelExamples: '',
    registrationNumber: '',
    seatCapacity: 4,
    luggageCapacity: 2,
    baseFarePerKm: 12,
    extraKmRate: 12,
    driverAllowance: 300,
    driverName: '',
    driverPhone: '',
    imageUrl: '',
  });

  // Rate Editing
  const [editingPropId, setEditingPropId] = useState<string | null>(null);
  const [editBasePrice, setEditBasePrice] = useState<number>(0);
  const [editDiscountedPrice, setEditDiscountedPrice] = useState<number>(0);

  // Check saved session
  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('wanderstay_partner_profile') : null;
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setPartner(parsed);
      } catch {
        // fallback
      }
    }
  }, []);

  const loadPartnerData = async (currentPartner = partner) => {
    if (!currentPartner) return;
    setLoading(true);
    try {
      const [ov, props, vehs, bks] = await Promise.all([
        apiClient.getPartnerOverview(currentPartner.id),
        apiClient.getPartnerProperties(currentPartner.id),
        apiClient.getPartnerVehicles(currentPartner.id),
        apiClient.getPartnerBookings(currentPartner.id),
      ]);

      if (ov) setOverview(ov);
      if (props) setProperties(props);
      if (vehs) setVehicles(vehs);
      if (bks) setBookings(bks);
    } catch (err) {
      console.error('Failed to load partner dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (partner) {
      loadPartnerData(partner);
    }
  }, [partner]);

  const handleLogin = async (e?: React.FormEvent, presetEmail?: string, presetPass?: string) => {
    if (e) e.preventDefault();
    setAuthError('');
    setLoading(true);
    try {
      const res = await apiClient.partnerLogin({
        email: presetEmail || loginEmail,
        password: presetPass || loginPassword,
      });

      if (res.partner) {
        localStorage.setItem('wanderstay_partner_profile', JSON.stringify(res.partner));
        setPartner(res.partner);
        setFeedback(`Welcome back, ${res.partner.businessName}!`);
        setTimeout(() => setFeedback(null), 4000);
      }
    } catch (err: any) {
      setAuthError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (regData.services.length === 0) {
      setAuthError('Please select at least one service offered (Hotels or Cabs).');
      return;
    }
    setLoading(true);
    try {
      const res = await apiClient.partnerRegister(regData);
      if (res.partner) {
        localStorage.setItem('wanderstay_partner_profile', JSON.stringify(res.partner));
        setPartner(res.partner);
        setFeedback('Registration complete! Welcome to WanderStay Partner Central.');
        setTimeout(() => setFeedback(null), 5000);
      }
    } catch (err: any) {
      setAuthError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('wanderstay_partner_profile');
    setPartner(null);
  };

  const handleToggleService = async (service: 'HOTELS' | 'CABS') => {
    if (!partner) return;
    const currentServices: ('HOTELS' | 'CABS')[] = [...partner.services];
    let updatedServices: ('HOTELS' | 'CABS')[];

    if (currentServices.includes(service)) {
      if (currentServices.length === 1) {
        alert('You must offer at least one service on WanderStay.');
        return;
      }
      updatedServices = currentServices.filter((s) => s !== service);
    } else {
      updatedServices = [...currentServices, service];
    }

    try {
      const res = await apiClient.updatePartnerServices(partner.id, updatedServices);
      setPartner(res.partner);
      localStorage.setItem('wanderstay_partner_profile', JSON.stringify(res.partner));
      setFeedback(`Services updated: ${updatedServices.join(' & ')} are now active on your account.`);
      setTimeout(() => setFeedback(null), 5000);
      setIsServicesModalOpen(false);
      await loadPartnerData(res.partner);
    } catch (err: any) {
      alert('Error updating services: ' + err.message);
    }
  };

  const handleAddProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: hotelForm.name,
        propertyType: hotelForm.propertyType,
        city: hotelForm.city,
        address: hotelForm.address,
        starRating: Number(hotelForm.starRating),
        basePrice: Number(hotelForm.basePrice),
        discountedPrice: Number(hotelForm.discountedPrice),
        amenities: hotelForm.amenities.split(',').map((a) => a.trim()).filter(Boolean),
        imageUrl: hotelForm.imageUrl,
        partnerId: partner.id,
        partnerName: partner.businessName,
      };

      await apiClient.createPartnerProperty(payload, partner.id);
      setIsPropertyModalOpen(false);
      setFeedback('Property submitted! It is queued in Super Admin queue for quality verification.');
      setTimeout(() => setFeedback(null), 6000);
      await loadPartnerData();
    } catch (err: any) {
      alert('Error listing property: ' + err.message);
    }
  };

  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...cabForm,
        seatCapacity: Number(cabForm.seatCapacity),
        luggageCapacity: Number(cabForm.luggageCapacity),
        baseFarePerKm: Number(cabForm.baseFarePerKm),
        extraKmRate: Number(cabForm.extraKmRate),
        driverAllowance: Number(cabForm.driverAllowance),
        operatorId: partner.id,
        operatorName: partner.businessName,
      };

      await apiClient.createOperatorVehicle(payload);
      setIsVehicleModalOpen(false);
      setFeedback('Commercial cab added to fleet! Queued for Super Admin quality & license inspection.');
      setTimeout(() => setFeedback(null), 6000);
      await loadPartnerData();
    } catch (err: any) {
      alert('Error adding vehicle: ' + err.message);
    }
  };

  const handleUpdateRates = async (propertyId: string) => {
    try {
      await apiClient.updatePartnerRates(propertyId, {
        basePrice: Number(editBasePrice),
        discountedPrice: Number(editDiscountedPrice),
      });
      setEditingPropId(null);
      setFeedback('Rates updated successfully! Live pricing is now refreshed.');
      setTimeout(() => setFeedback(null), 4000);
      await loadPartnerData();
    } catch (err: any) {
      alert('Error updating rates: ' + err.message);
    }
  };

  // 1. UNAUTHENTICATED: LOGIN OR REGISTER SCREEN
  if (!partner) {
    return (
      <div className="min-h-screen bg-[#F4F6F8] flex items-center justify-center p-4">
        <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-[#94A3B8]/40 overflow-hidden">
          {/* Header */}
          <div className="bg-[#0F172A] p-8 text-center text-[#F4F6F8]">
            <div className="h-14 w-14 mx-auto rounded-2xl bg-gradient-to-tr from-[#C25E34] via-[#0084FF] to-[#94A3B8] flex items-center justify-center mb-3 shadow-lg">
              <Briefcase className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-2xl font-black font-sans font-black tracking-tight">WanderStay Partner Central</h1>
            <p className="text-xs text-[#94A3B8] mt-1">
              Unified Portal for Accommodations Hosts, Cab Operators &amp; Integrated Travel Providers
            </p>

            {/* Auth Switcher Tabs */}
            <div className="flex bg-white/10 rounded-xl p-1 mt-5 max-w-xs mx-auto text-xs font-bold">
              <button
                onClick={() => { setAuthMode('LOGIN'); setAuthError(''); }}
                className={`flex-1 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  authMode === 'LOGIN' ? 'bg-[#C25E34] text-[#18181B] text-white shadow-sm' : 'text-gray-300 hover:text-white'
                }`}
              >
                Partner Sign In
              </button>
              <button
                onClick={() => { setAuthMode('REGISTER'); setAuthError(''); }}
                className={`flex-1 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  authMode === 'REGISTER' ? 'bg-[#C25E34] text-[#18181B] text-white shadow-sm' : 'text-gray-300 hover:text-white'
                }`}
              >
                Register Business
              </button>
            </div>
          </div>

          {/* Form Area */}
          <div className="p-8">
            {authError && (
              <div className="p-3.5 mb-5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            {authMode === 'LOGIN' ? (
              <form onSubmit={(e) => handleLogin(e)} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-1">
                    Partner Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[#94A3B8]/60 text-xs font-semibold text-[#0F172A] focus:ring-2 focus:ring-[#C25E34] outline-none"
                    placeholder="partner@wanderstay.com"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-1">
                    Account Password
                  </label>
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[#94A3B8]/60 text-xs font-semibold text-[#0F172A] focus:ring-2 focus:ring-[#C25E34] outline-none"
                    placeholder="••••••••••••"
                  />
                </div>

                {/* Instant Demo Account Pickers */}
                <div className="p-4 bg-[#F4F6F8] rounded-2xl border border-[#94A3B8]/40 text-xs space-y-2">
                  <p className="font-bold text-[#C25E34] flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Instant Demo Accounts (Select to Test Different Persona Portals):</span>
                  </p>

                  <div className="grid grid-cols-1 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleLogin(undefined, 'integrated@wanderstay.com', 'Partner@2026')}
                      className="p-2.5 rounded-xl bg-white border border-[#94A3B8]/60 hover:border-[#C25E34] text-left transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center justify-between">
                        <strong className="text-[#0F172A] font-bold">1. Integrated Provider (Hotels + Cab Fleet)</strong>
                        <span className="text-[10px] bg-[#C25E34] text-[#18181B]/10 text-[#C25E34] font-bold px-2 py-0.5 rounded">BOTH SERVICES</span>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-0.5">Operates luxury resort &amp; commercial Mercedes/Innova chauffeur fleet.</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleLogin(undefined, 'hotelier@wanderstay.com', 'Partner@2026')}
                      className="p-2.5 rounded-xl bg-white border border-[#94A3B8]/60 hover:border-[#C25E34] text-left transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center justify-between">
                        <strong className="text-[#0F172A] font-bold">2. Hotelier / Homestay Host Only</strong>
                        <span className="text-[10px] bg-stone-200 text-stone-800 font-bold px-2 py-0.5 rounded">STAYS ONLY</span>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-0.5">Operates boutique plantation homestay &amp; cottages.</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleLogin(undefined, 'caboperator@wanderstay.com', 'Partner@2026')}
                      className="p-2.5 rounded-xl bg-white border border-[#94A3B8]/60 hover:border-[#C25E34] text-left transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center justify-between">
                        <strong className="text-[#0F172A] font-bold">3. Cab Fleet Operator Only</strong>
                        <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded">CABS ONLY</span>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-0.5">Commercial fleet operator managing outstation sedans and SUVs.</p>
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-search-gradient text-white py-3.5 rounded-xl font-bold text-xs tracking-wider uppercase shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  {loading ? 'Authenticating...' : 'Sign In to Partner Central'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#0F172A] mb-1">Company / Brand Name *</label>
                    <input
                      type="text"
                      required
                      value={regData.businessName}
                      onChange={(e) => setRegData({ ...regData, businessName: e.target.value })}
                      placeholder="e.g. Royal Heritage Stays & Cabs"
                      className="w-full px-3 py-2.5 rounded-xl border border-[#94A3B8]/60 text-xs font-semibold focus:ring-2 focus:ring-[#C25E34] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0F172A] mb-1">Contact Person Name *</label>
                    <input
                      type="text"
                      required
                      value={regData.contactName}
                      onChange={(e) => setRegData({ ...regData, contactName: e.target.value })}
                      placeholder="e.g. Aditya Verma"
                      className="w-full px-3 py-2.5 rounded-xl border border-[#94A3B8]/60 text-xs font-semibold focus:ring-2 focus:ring-[#C25E34] outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#0F172A] mb-1">Business Email *</label>
                    <input
                      type="email"
                      required
                      value={regData.email}
                      onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                      placeholder="partner@business.com"
                      className="w-full px-3 py-2.5 rounded-xl border border-[#94A3B8]/60 text-xs font-semibold focus:ring-2 focus:ring-[#C25E34] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0F172A] mb-1">Mobile / WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      value={regData.phone}
                      onChange={(e) => setRegData({ ...regData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full px-3 py-2.5 rounded-xl border border-[#94A3B8]/60 text-xs font-semibold focus:ring-2 focus:ring-[#C25E34] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0F172A] mb-1">Password *</label>
                  <input
                    type="password"
                    required
                    value={regData.password}
                    onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#94A3B8]/60 text-xs font-semibold focus:ring-2 focus:ring-[#C25E34] outline-none"
                  />
                </div>

                {/* Service Selection Checkboxes */}
                <div className="pt-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-2">
                    What Services Does Your Business Provide? *
                  </label>
                  <p className="text-[11px] text-gray-500 mb-3">
                    Choose one or both. Your partner dashboard tools will automatically adapt to your selection.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label
                      className={`p-4 rounded-2xl border-2 flex items-start gap-3 cursor-pointer transition-all ${
                        regData.services.includes('HOTELS')
                          ? 'border-[#C25E34] bg-[#C25E34] text-[#18181B]/5'
                          : 'border-[#94A3B8]/40 bg-white'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={regData.services.includes('HOTELS')}
                        onChange={(e) => {
                          const updated = e.target.checked
                            ? [...regData.services, 'HOTELS' as const]
                            : regData.services.filter((s) => s !== 'HOTELS');
                          setRegData({ ...regData, services: updated });
                        }}
                        className="mt-1 h-4 w-4 text-[#C25E34] rounded focus:ring-[#C25E34]"
                      />
                      <div>
                        <strong className="block text-xs text-[#0F172A] font-bold flex items-center gap-1.5">
                          <Hotel className="h-4 w-4 text-[#C25E34]" />
                          <span>Accommodations</span>
                        </strong>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          Hotels, Resorts, Homestays &amp; Luxury Villas
                        </p>
                      </div>
                    </label>

                    <label
                      className={`p-4 rounded-2xl border-2 flex items-start gap-3 cursor-pointer transition-all ${
                        regData.services.includes('CABS')
                          ? 'border-[#C25E34] bg-[#C25E34] text-[#18181B]/5'
                          : 'border-[#94A3B8]/40 bg-white'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={regData.services.includes('CABS')}
                        onChange={(e) => {
                          const updated = e.target.checked
                            ? [...regData.services, 'CABS' as const]
                            : regData.services.filter((s) => s !== 'CABS');
                          setRegData({ ...regData, services: updated });
                        }}
                        className="mt-1 h-4 w-4 text-[#C25E34] rounded focus:ring-[#C25E34]"
                      />
                      <div>
                        <strong className="block text-xs text-[#0F172A] font-bold flex items-center gap-1.5">
                          <Car className="h-4 w-4 text-amber-500" />
                          <span>Cab &amp; Chauffeur Fleet</span>
                        </strong>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          Commercial Cabs, Airport Transfers &amp; Outstation
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-search-gradient text-white py-3.5 rounded-xl font-bold text-xs tracking-wider uppercase shadow-md hover:shadow-lg transition-all cursor-pointer mt-4"
                >
                  {loading ? 'Creating Account...' : 'Complete Partner Registration'}
                </button>
              </form>
            )}

            <div className="text-center mt-6">
              <Link href="/" className="text-xs font-semibold text-[#C25E34] hover:underline">
                &larr; Return to Public Guest Website
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. AUTHENTICATED: DYNAMIC UNIFIED PARTNER DASHBOARD
  const hasHotels = partner.services?.includes('HOTELS');
  const hasCabs = partner.services?.includes('CABS');
  const hasBoth = hasHotels && hasCabs;

  return (
    <div className="min-h-screen bg-[#F4F6F8] text-[#0F172A]">
      {/* Top Partner Navigation */}
      <header className="sticky top-0 z-40 bg-[#0F172A] text-[#F4F6F8] shadow-md border-b border-[#3D3532]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-[#C25E34] via-[#0084FF] to-[#94A3B8] flex items-center justify-center font-black shadow-md">
                <Briefcase className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-black font-sans font-black tracking-tight text-white">
                    Wander<span className="text-[#C25E34] italic">Stay</span>
                  </span>
                  <span className="rounded bg-stone-700 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-white">
                    PARTNER CENTRAL
                  </span>
                </div>
                <p className="text-[10px] text-[#94A3B8]">
                  {partner.businessName} • {partner.contactName}
                </p>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 text-xs">
            {/* Active Service Badges */}
            <div className="hidden md:flex items-center gap-2">
              {hasHotels && (
                <span className="flex items-center gap-1 rounded-full bg-amber-500/10 text-stone-300 border border-amber-500/30 px-2.5 py-1 text-[11px] font-bold">
                  <Hotel className="h-3 w-3" />
                  <span>Stays Enabled</span>
                </span>
              )}
              {hasCabs && (
                <span className="flex items-center gap-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 px-2.5 py-1 text-[11px] font-bold">
                  <Car className="h-3 w-3" />
                  <span>Cab Fleet Enabled</span>
                </span>
              )}
            </div>

            {/* Service Customizer Button */}
            <button
              onClick={() => setIsServicesModalOpen(true)}
              className="rounded-lg bg-white/10 hover:bg-white/20 px-3 py-1.5 font-bold text-white transition-colors flex items-center gap-1.5 cursor-pointer text-xs"
              title="Add or remove business services"
            >
              <Settings className="h-3.5 w-3.5 text-[#94A3B8]" />
              <span className="hidden sm:inline">Manage Services</span>
            </button>

            {/* Live Guest Marketplace Link */}
            <Link
              href="/"
              target="_blank"
              className="rounded-lg bg-white/10 hover:bg-white/20 px-3 py-1.5 font-bold text-white transition-colors flex items-center gap-1"
            >
              <span className="hidden sm:inline">Live Marketplace</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>

            {/* Sign Out */}
            <button
              onClick={handleLogout}
              className="rounded-lg bg-red-600/80 hover:bg-red-600 px-3 py-1.5 font-bold text-white transition-colors flex items-center gap-1 cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Dynamic Partner Navigation Strip */}
        <div className="border-t border-[#3D3532] bg-[#1E1A19]">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 py-2 overflow-x-auto">
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={() => setActiveTab('OVERVIEW')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'OVERVIEW' ? 'bg-[#C25E34] text-[#18181B] text-white' : 'text-[#94A3B8] hover:text-white'
                }`}
              >
                <TrendingUp className="h-3.5 w-3.5" />
                <span>Executive Overview</span>
              </button>

              {/* Stays Tab (Conditional on Partner Having Hotels/Stays) */}
              {hasHotels && (
                <button
                  onClick={() => setActiveTab('HOTELS')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'HOTELS' ? 'bg-[#C25E34] text-[#18181B] text-white' : 'text-[#94A3B8] hover:text-white'
                  }`}
                >
                  <Hotel className="h-3.5 w-3.5" />
                  <span>Accommodations &amp; Stays ({properties.length})</span>
                </button>
              )}

              {/* Cabs Tab (Conditional on Partner Having Cabs) */}
              {hasCabs && (
                <button
                  onClick={() => setActiveTab('CABS')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'CABS' ? 'bg-[#C25E34] text-[#18181B] text-white' : 'text-[#94A3B8] hover:text-white'
                  }`}
                >
                  <Car className="h-3.5 w-3.5" />
                  <span>Fleet &amp; Cabs ({vehicles.length})</span>
                </button>
              )}

              {/* Unified Bookings Ledger */}
              <button
                onClick={() => setActiveTab('BOOKINGS')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'BOOKINGS' ? 'bg-[#C25E34] text-[#18181B] text-white' : 'text-[#94A3B8] hover:text-white'
                }`}
              >
                <Clock className="h-3.5 w-3.5" />
                <span>Bookings &amp; Trips Ledger ({bookings.length})</span>
              </button>

              {/* IngoMMT Parity: 90-Day Room Availability & Dynamic Rate Calendar */}
              {hasHotels && (
                <button
                  onClick={() => setActiveTab('CALENDAR')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'CALENDAR' ? 'bg-[#C25E34] text-[#18181B] text-white' : 'text-[#94A3B8] hover:text-white'
                  }`}
                >
                  <Calendar className="h-3.5 w-3.5" />
                  <span>90-Day Rates &amp; Inventory</span>
                </button>
              )}
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              {hasHotels && (
                <button
                  onClick={() => setIsPropertyModalOpen(true)}
                  className="btn-search-gradient px-3 py-1.5 text-xs font-bold text-white rounded-lg shadow-sm flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>List Stay</span>
                </button>
              )}

              {hasCabs && (
                <button
                  onClick={() => setIsVehicleModalOpen(true)}
                  className="bg-amber-600 hover:bg-amber-700 px-3 py-1.5 text-xs font-bold text-white rounded-lg shadow-sm flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Cab</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Banner Feedback */}
        {feedback && (
          <div className="p-4 bg-stone-200 border border-stone-300 text-stone-900 rounded-2xl flex items-center gap-3 shadow-md animate-fade-in">
            <CheckCircle2 className="h-5 w-5 text-amber-500 shrink-0" />
            <p className="text-xs font-bold">{feedback}</p>
          </div>
        )}

        {/* Opportunity Banner if partner only offers one service */}
        {!hasBoth && (
          <div className="p-5 rounded-3xl bg-white border border-[#94A3B8]/40 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="h-10 w-10 rounded-2xl bg-[#C25E34] text-[#18181B]/10 flex items-center justify-center shrink-0">
                <Sparkles className="h-5 w-5 text-[#C25E34]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#0F172A]">
                  {hasHotels
                    ? 'Offer Airport & Outstation Cabs to Your Guests?'
                    : 'Own Homestays, Cottages, or Luxury Villas?'}
                </h3>
                <p className="text-xs text-gray-600 mt-0.5">
                  {hasHotels
                    ? 'Earn additional margins by enabling Cab & Chauffeur services to transfer guests to and from your properties.'
                    : 'Expand your hospitality enterprise by listing boutique stays and vacation rentals under the same account.'}
                </p>
              </div>
            </div>
            <button
              onClick={() => handleToggleService(hasHotels ? 'CABS' : 'HOTELS')}
              className="btn-search-gradient px-4 py-2 text-xs font-bold text-white rounded-xl shadow-md shrink-0 cursor-pointer"
            >
              {hasHotels ? '+ Enable Cab Services' : '+ Enable Stays & Homestays'}
            </button>
          </div>
        )}

        {/* TAB 1: EXECUTIVE OVERVIEW */}
        {activeTab === 'OVERVIEW' && (
          <div className="space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="rounded-3xl bg-white border border-[#94A3B8]/40 p-6 shadow-sm">
                <span className="text-xs text-gray-500 block mb-1">Total Gross Earnings</span>
                <div className="text-3xl font-black font-sans font-black text-[#0F172A]">
                  ₹{(overview?.metrics?.totalRevenue || 18530).toLocaleString('en-IN')}
                </div>
                <span className="text-[11px] text-stone-700 font-bold mt-1 block">
                  {hasBoth ? 'Combined Stays + Cabs' : hasHotels ? 'Accommodations Revenue' : 'Fleet Bookings Revenue'}
                </span>
              </div>

              {hasHotels && (
                <div className="rounded-3xl bg-white border border-[#94A3B8]/40 p-6 shadow-sm">
                  <span className="text-xs text-gray-500 block mb-1">Accommodations Managed</span>
                  <div className="text-3xl font-black font-sans font-black text-[#C25E34]">
                    {properties.length} Stays
                  </div>
                  <span className="text-[11px] text-[#C25E34] font-bold mt-1 block">
                    {properties.filter((p) => p.status === 'ACTIVE').length} Active | {properties.filter((p) => p.status === 'PENDING_APPROVAL').length} In Quality Review
                  </span>
                </div>
              )}

              {hasCabs && (
                <div className="rounded-3xl bg-white border border-[#94A3B8]/40 p-6 shadow-sm">
                  <span className="text-xs text-gray-500 block mb-1">Commercial Cab Fleet</span>
                  <div className="text-3xl font-black font-sans font-black text-[#0F172A]">
                    {vehicles.length} Cabs
                  </div>
                  <span className="text-[11px] text-amber-700 font-bold mt-1 block">
                    {vehicles.filter((v) => v.status === 'ACTIVE').length} Active on Highway | {vehicles.filter((v) => v.status === 'PENDING_APPROVAL').length} Pending
                  </span>
                </div>
              )}

              <div className="rounded-3xl bg-white border border-[#94A3B8]/40 p-6 shadow-sm">
                <span className="text-xs text-gray-500 block mb-1">Total Reservations Fulfilled</span>
                <div className="text-3xl font-black font-sans font-black text-[#0F172A]">
                  {bookings.length} Bookings
                </div>
                <span className="text-[11px] text-stone-700 font-bold mt-1 block">Fulfillment rate 99.4%</span>
              </div>
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {hasHotels && (
                <div className="rounded-3xl bg-white border border-[#94A3B8]/40 p-6 shadow-sm flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold font-sans font-black text-[#0F172A]">Stays Portfolio</h3>
                    <p className="text-xs text-gray-600 mt-1">Manage room inventory, pricing, and guest check-ins.</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('HOTELS')}
                    className="px-4 py-2 rounded-xl border border-[#94A3B8] text-xs font-bold text-[#0F172A] hover:bg-[#F4F6F8] transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>View Stays</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}

              {hasCabs && (
                <div className="rounded-3xl bg-white border border-[#94A3B8]/40 p-6 shadow-sm flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold font-sans font-black text-[#0F172A]">Fleet Management</h3>
                    <p className="text-xs text-gray-600 mt-1">Chauffeur details, vehicle registrations, and trip dispatches.</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('CABS')}
                    className="px-4 py-2 rounded-xl border border-[#94A3B8] text-xs font-bold text-[#0F172A] hover:bg-[#F4F6F8] transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>View Fleet</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: ACCOMMODATIONS & STAYS */}
        {activeTab === 'HOTELS' && hasHotels && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black font-sans font-black text-[#0F172A]">Your Stays &amp; Homestays Portfolio</h2>
                <p className="text-xs text-gray-600">Hotels, Resorts, Homestays &amp; Luxury Villas.</p>
              </div>
              <button
                onClick={() => setIsPropertyModalOpen(true)}
                className="btn-search-gradient px-4 py-2 text-xs font-bold text-white rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>List New Property</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <div
                  key={property.id}
                  className="rounded-3xl bg-white border border-[#94A3B8]/40 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="relative h-48 w-full">
                    <img
                      src={property.imageUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'}
                      alt={property.name}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-full bg-[#0F172A]/80 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider">
                        {property.propertyType || 'HOTEL'}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm ${
                          property.status === 'ACTIVE'
                            ? 'bg-amber-500 text-white'
                            : property.status === 'PENDING_APPROVAL'
                            ? 'bg-amber-500 text-white'
                            : 'bg-red-600 text-white'
                        }`}
                      >
                        {property.status === 'ACTIVE' ? 'LIVE MARKETPLACE' : property.status}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-500 flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-[#C25E34]" />
                        <span>{property.city}</span>
                      </span>
                      <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                        <span>{property.starRating || 5}.0</span>
                      </span>
                    </div>

                    <h3 className="text-base font-bold font-sans font-black text-[#0F172A] leading-snug line-clamp-1">
                      {property.name}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-2">{property.address}</p>

                    <div className="pt-3 border-t border-[#94A3B8]/20 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-gray-400 block">Nightly Price</span>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-base font-black font-sans font-black text-[#C25E34]">
                            ₹{property.discountedPrice || property.basePrice}
                          </span>
                          {property.discountedPrice && property.discountedPrice < property.basePrice && (
                            <span className="text-xs text-gray-400 line-through">₹{property.basePrice}</span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setEditingPropId(property.id);
                          setEditBasePrice(property.basePrice);
                          setEditDiscountedPrice(property.discountedPrice || property.basePrice);
                        }}
                        className="px-3 py-1.5 rounded-lg border border-[#94A3B8] text-xs font-bold text-[#0F172A] hover:bg-[#F4F6F8] transition-colors flex items-center gap-1"
                      >
                        <Edit3 className="h-3.5 w-3.5 text-[#C25E34]" />
                        <span>Edit Rates</span>
                      </button>
                    </div>

                    {/* Inline Rate Editor */}
                    {editingPropId === property.id && (
                      <div className="mt-3 p-3 bg-[#F4F6F8] rounded-xl border border-[#94A3B8]/40 space-y-2">
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-[10px] text-gray-500 block">Base Rate (₹)</span>
                            <input
                              type="number"
                              value={editBasePrice}
                              onChange={(e) => setEditBasePrice(Number(e.target.value))}
                              className="w-full px-2 py-1 rounded border border-[#94A3B8] text-xs font-bold"
                            />
                          </div>
                          <div>
                            <span className="text-[10px] text-gray-500 block">Offer Rate (₹)</span>
                            <input
                              type="number"
                              value={editDiscountedPrice}
                              onChange={(e) => setEditDiscountedPrice(Number(e.target.value))}
                              className="w-full px-2 py-1 rounded border border-[#94A3B8] text-xs font-bold text-[#C25E34]"
                            />
                          </div>
                        </div>
                        <div className="flex items-center justify-end gap-2 pt-1">
                          <button
                            onClick={() => setEditingPropId(null)}
                            className="px-2 py-1 text-xs text-gray-500 font-bold"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleUpdateRates(property.id)}
                            className="px-3 py-1 bg-[#C25E34] text-[#18181B] text-white text-xs font-bold rounded-lg"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: FLEET & CABS */}
        {activeTab === 'CABS' && hasCabs && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black font-sans font-black text-[#0F172A]">Commercial Cab Fleet</h2>
                <p className="text-xs text-gray-600">Registered vehicles, assigned chauffeurs, and per-km pricing.</p>
              </div>
              <button
                onClick={() => setIsVehicleModalOpen(true)}
                className="bg-amber-600 hover:bg-amber-700 px-4 py-2 text-xs font-bold text-white rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm"
              >
                <Plus className="h-4 w-4" />
                <span>Add Vehicle</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vehicles.map((v) => (
                <div
                  key={v.id}
                  className="rounded-3xl bg-white border border-[#94A3B8]/40 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="relative h-44 w-full">
                    <img
                      src={v.imageUrl || 'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=600'}
                      alt={v.name}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-full bg-[#0F172A]/80 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider">
                        {v.category}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm ${
                          v.status === 'ACTIVE'
                            ? 'bg-amber-500 text-white'
                            : v.status === 'PENDING_APPROVAL'
                            ? 'bg-amber-500 text-white'
                            : 'bg-red-600 text-white'
                        }`}
                      >
                        {v.status === 'ACTIVE' ? 'LIVE ON HIGHWAY' : v.status}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-[#0F172A] bg-gray-100 px-2 py-0.5 rounded border border-gray-300">
                        {v.registrationNumber}
                      </span>
                      <span className="text-xs font-bold text-[#C25E34]">
                        ₹{v.baseFarePerKm}/km
                      </span>
                    </div>

                    <h3 className="text-base font-bold font-sans font-black text-[#0F172A] line-clamp-1">{v.name}</h3>
                    <p className="text-xs text-gray-500 line-clamp-1">{v.modelExamples}</p>

                    <div className="pt-3 border-t border-[#94A3B8]/20 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-gray-400 block">Chauffeur</span>
                        <strong className="text-[#0F172A] block">{v.driverName}</strong>
                        <span className="text-[10px] text-gray-500">{v.driverPhone}</span>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-gray-400 block">Capacity</span>
                        <span className="text-xs font-bold text-gray-700">{v.seatCapacity} Seats • {v.luggageCapacity} Bags</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: UNIFIED BOOKINGS LEDGER */}
        {activeTab === 'BOOKINGS' && (
          <div className="rounded-3xl bg-white border border-[#94A3B8]/40 overflow-hidden shadow-sm">
            <div className="p-5 border-b border-[#94A3B8]/30 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold font-sans font-black text-[#0F172A]">Unified Bookings &amp; Trips Ledger</h2>
                <p className="text-xs text-gray-500">Live guest reservations and chauffeur dispatches.</p>
              </div>
              <span className="text-xs font-bold text-[#C25E34]">{bookings.length} Total Records</span>
            </div>

            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left">
                <thead className="bg-[#F4F6F8] text-gray-700 uppercase tracking-wider text-[10px] border-b border-[#94A3B8]/30">
                  <tr>
                    <th className="p-4">Reference</th>
                    <th className="p-4">Service Category</th>
                    <th className="p-4">Customer Name</th>
                    <th className="p-4">Details / Dates</th>
                    <th className="p-4">Payout Amount</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#94A3B8]/20">
                  {bookings.map((b) => (
                    <tr key={b.bookingReference} className="hover:bg-[#F4F6F8]/50 transition-colors">
                      <td className="p-4 font-mono font-bold text-[#0F172A]">{b.bookingReference}</td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            b.category === 'HOTEL'
                              ? 'bg-stone-200 text-stone-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {b.category === 'HOTEL' ? 'ACCOMMODATION' : 'CAB DISPATCH'}
                        </span>
                      </td>
                      <td className="p-4 font-semibold text-[#0F172A]">{b.leadGuestName || b.passengerName || 'Verified Guest'}</td>
                      <td className="p-4">
                        <strong className="block text-[#0F172A]">{b.hotelName || b.cabName}</strong>
                        <span className="text-[10px] text-gray-500">
                          {b.category === 'HOTEL' ? `${b.checkInDate} to ${b.checkOutDate}` : `${b.fromCity} → ${b.toCity}`}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-stone-700">₹{b.totalPayable}</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-200 text-stone-800">
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: IngoMMT Parity: 90-DAY ROOM AVAILABILITY & SURGE CALENDAR */}
        {activeTab === 'CALENDAR' && hasHotels && (
          <div className="space-y-6">
            {/* Top Toolbar */}
            <div className="bg-white rounded-3xl p-6 border border-[#94A3B8]/40 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#C25E34] block">
                  IngoMMT Parity • Revenue Management
                </span>
                <h2 className="text-xl font-bold font-black text-[#0F172A]">
                  90-Day Room Rates &amp; Availability Calendar
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Click any date to block rooms (stop-sell) or set custom holiday surge pricing
                </p>
              </div>

              {/* Quick Preset Actions */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const newOverrides = { ...calendarOverrides };
                    // Apply +25% on all weekend dates in Nov/Dec
                    for (let day = 1; day <= 31; day++) {
                      const dStr = day < 10 ? `0${day}` : `${day}`;
                      const novDate = new Date(`2026-11-${dStr}`);
                      if (novDate.getDay() === 5 || novDate.getDay() === 6 || novDate.getDay() === 0) {
                        newOverrides[`2026-11-${dStr}`] = { blocked: false, surgePct: 25 };
                      }
                      const decDate = new Date(`2026-12-${dStr}`);
                      if (decDate.getDay() === 5 || decDate.getDay() === 6 || decDate.getDay() === 0) {
                        newOverrides[`2026-12-${dStr}`] = { blocked: false, surgePct: 25 };
                      }
                    }
                    setCalendarOverrides(newOverrides);
                    setFeedback('Applied +25% weekend surge across all Friday, Saturday & Sunday dates!');
                    setTimeout(() => setFeedback(null), 3000);
                  }}
                  className="px-3 py-1.5 rounded-full bg-[#EFF6FF] text-[#C25E34] border border-[#94A3B8] text-xs font-bold hover:bg-[#C25E34] text-[#18181B] hover:text-white transition-colors cursor-pointer"
                >
                  ⚡ Weekend Surge (+25%)
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const newOverrides = { ...calendarOverrides };
                    ['2026-12-24', '2026-12-25', '2026-12-26', '2026-12-27', '2026-12-28', '2026-12-29', '2026-12-30', '2026-12-31', '2027-01-01', '2027-01-02'].forEach((d) => {
                      newOverrides[d] = { blocked: false, surgePct: 40, customPrice: 18500 };
                    });
                    setCalendarOverrides(newOverrides);
                    setFeedback('Applied New Year peak season rate (₹18,500/night) for Dec 24 – Jan 02!');
                    setTimeout(() => setFeedback(null), 3000);
                  }}
                  className="px-3 py-1.5 rounded-full bg-[#EFF6FF] text-[#C25E34] border border-[#94A3B8] text-xs font-bold hover:bg-[#C25E34] text-[#18181B] hover:text-white transition-colors cursor-pointer"
                >
                  🎉 Holiday Peak (Dec 24 - Jan 2)
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCalendarOverrides({});
                    setFeedback('Reset calendar to standard base rate (₹9,900/night)');
                    setTimeout(() => setFeedback(null), 3000);
                  }}
                  className="px-3 py-1.5 rounded-full border border-gray-300 text-xs text-gray-600 font-semibold hover:bg-gray-100 cursor-pointer"
                >
                  Reset Defaults
                </button>
              </div>
            </div>

            {/* 3-Month Interactive Calendar Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {[
                { monthName: 'November 2026', daysInMonth: 30, yearMonth: '2026-11', startDayOffset: 0 },
                { monthName: 'December 2026', daysInMonth: 31, yearMonth: '2026-12', startDayOffset: 2 },
                { monthName: 'January 2027', daysInMonth: 31, yearMonth: '2027-01', startDayOffset: 5 },
              ].map((month) => (
                <div key={month.monthName} className="bg-white rounded-3xl p-5 border border-[#94A3B8]/40 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
                    <h3 className="font-black font-bold text-base text-[#0F172A]">
                      {month.monthName}
                    </h3>
                    <span className="text-[10px] font-bold text-[#C25E34] bg-[#EFF6FF] px-2 py-0.5 rounded border border-[#94A3B8]/40">
                      Standard: ₹9,900
                    </span>
                  </div>

                  {/* Day of Week Headers */}
                  <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-[#877B76]">
                    <span>Su</span>
                    <span>Mo</span>
                    <span>Tu</span>
                    <span>We</span>
                    <span>Th</span>
                    <span>Fr</span>
                    <span>Sa</span>
                  </div>

                  {/* Calendar Days */}
                  <div className="grid grid-cols-7 gap-1.5">
                    {/* Blank offset days */}
                    {Array.from({ length: month.startDayOffset }).map((_, i) => (
                      <div key={`blank-${i}`} className="h-14 rounded-xl bg-[#F8FAFC]/40" />
                    ))}

                    {/* Active days */}
                    {Array.from({ length: month.daysInMonth }).map((_, i) => {
                      const dayNum = i + 1;
                      const dateKey = `${month.yearMonth}-${dayNum < 10 ? `0${dayNum}` : dayNum}`;
                      const override = calendarOverrides[dateKey];
                      const isBlocked = override?.blocked;
                      const hasSurge = !isBlocked && (override?.surgePct || override?.customPrice);
                      const displayPrice = override?.customPrice
                        ? override.customPrice
                        : override?.surgePct
                        ? Math.round(9900 * (1 + override.surgePct / 100))
                        : 9900;

                      return (
                        <button
                          key={dateKey}
                          type="button"
                          onClick={() => {
                            const newOverrides = { ...calendarOverrides };
                            if (isBlocked) {
                              // Unblock
                              newOverrides[dateKey] = { blocked: false };
                              setFeedback(`Unblocked ${dateKey} for bookings!`);
                            } else {
                              // Block
                              newOverrides[dateKey] = { blocked: true };
                              setFeedback(`Blocked ${dateKey} (Stop-Sell active)`);
                            }
                            setCalendarOverrides(newOverrides);
                            setTimeout(() => setFeedback(null), 2500);
                          }}
                          className={`h-14 rounded-xl border p-1 flex flex-col justify-between text-left transition-all cursor-pointer ${
                            isBlocked
                              ? 'bg-rose-50 border-rose-300 text-rose-900 opacity-80'
                              : hasSurge
                              ? 'bg-amber-50 border-amber-300 text-amber-950 font-bold'
                              : 'bg-white border-[#E2E8F0] hover:border-[#C25E34] text-[#0F172A]'
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="text-[11px] font-bold leading-none">{dayNum}</span>
                            {isBlocked ? (
                              <span className="h-2 w-2 rounded-full bg-rose-500" />
                            ) : hasSurge ? (
                              <span className="text-[8px] bg-amber-200 text-amber-900 px-1 rounded font-bold">
                                +{override.surgePct || 'Peak'}%
                              </span>
                            ) : (
                              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                            )}
                          </div>
                          <span className="text-[9px] font-mono leading-none block">
                            {isBlocked ? (
                              <span className="text-rose-700 font-bold">BLOCKED</span>
                            ) : (
                              `₹${(displayPrice / 1000).toFixed(1)}k`
                            )}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Legend Bar */}
            <div className="bg-white rounded-2xl p-4 border border-[#94A3B8]/40 flex flex-wrap items-center justify-between gap-4 text-xs text-[#574E4A]">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-amber-500" />
                  <span>Available (Base Rate)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-amber-400" />
                  <span>Weekend / Holiday Surge</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-rose-500" />
                  <span>Blocked (Stop Sell)</span>
                </div>
              </div>
              <span className="text-[11px] text-[#C25E34] font-bold">
                ✓ Inventory updates sync live in &lt; 200ms
              </span>
            </div>
          </div>
        )}
      </main>

      {/* MANAGE SERVICES MODAL */}
      {isServicesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[#94A3B8]/40 overflow-hidden">
            <div className="bg-[#0F172A] p-6 text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold font-sans font-black">Manage Business Services</h3>
                <p className="text-xs text-[#94A3B8]">Toggle which travel services your business offers</p>
              </div>
              <button
                onClick={() => setIsServicesModalOpen(false)}
                className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="h-4 w-4 text-white" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <label
                className={`p-4 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                  hasHotels ? 'border-[#C25E34] bg-[#C25E34] text-[#18181B]/5' : 'border-[#94A3B8]/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-stone-200 flex items-center justify-center">
                    <Hotel className="h-5 w-5 text-stone-700" />
                  </div>
                  <div>
                    <strong className="block text-sm text-[#0F172A] font-bold">Accommodations &amp; Stays</strong>
                    <span className="text-[11px] text-gray-500">Hotels, Resorts, Homestays &amp; Villas</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={hasHotels}
                  onChange={() => handleToggleService('HOTELS')}
                  className="h-5 w-5 text-[#C25E34] rounded focus:ring-[#C25E34]"
                />
              </label>

              <label
                className={`p-4 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                  hasCabs ? 'border-[#C25E34] bg-[#C25E34] text-[#18181B]/5' : 'border-[#94A3B8]/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-amber-100 flex items-center justify-center">
                    <Car className="h-5 w-5 text-amber-700" />
                  </div>
                  <div>
                    <strong className="block text-sm text-[#0F172A] font-bold">Cab &amp; Chauffeur Fleet</strong>
                    <span className="text-[11px] text-gray-500">Commercial Outstation &amp; Airport Cabs</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={hasCabs}
                  onChange={() => handleToggleService('CABS')}
                  className="h-5 w-5 text-[#C25E34] rounded focus:ring-[#C25E34]"
                />
              </label>

              <div className="pt-2 text-right">
                <button
                  type="button"
                  onClick={() => setIsServicesModalOpen(false)}
                  className="btn-search-gradient px-5 py-2 text-xs font-bold text-white rounded-xl shadow-md"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LIST PROPERTY MODAL */}
      {isPropertyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#94A3B8]/40 overflow-hidden my-8">
            <div className="bg-[#0F172A] p-6 text-white flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black font-sans font-black">List New Accommodation</h3>
                <p className="text-xs text-[#94A3B8]">Hotels, Resorts, Homestays &amp; Luxury Villas</p>
              </div>
              <button
                onClick={() => setIsPropertyModalOpen(false)}
                className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="h-4 w-4 text-white" />
              </button>
            </div>

            <form onSubmit={handleAddProperty} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#0F172A] mb-1">Property Name *</label>
                  <input
                    type="text"
                    required
                    value={hotelForm.name}
                    onChange={(e) => setHotelForm({ ...hotelForm, name: e.target.value })}
                    placeholder="e.g. Greenwood Estate Homestay"
                    className="w-full px-3 py-2.5 rounded-xl border border-[#94A3B8]/60 text-xs font-semibold focus:ring-2 focus:ring-[#C25E34] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#0F172A] mb-1">Property Type *</label>
                  <select
                    value={hotelForm.propertyType}
                    onChange={(e) => setHotelForm({ ...hotelForm, propertyType: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#94A3B8]/60 text-xs font-semibold focus:ring-2 focus:ring-[#C25E34] outline-none"
                  >
                    <option value="HOTEL">Hotel</option>
                    <option value="RESORT">Luxury Resort &amp; Spa</option>
                    <option value="HOMESTAY">Boutique Homestay</option>
                    <option value="VILLA">Private Luxury Villa</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#0F172A] mb-1">Destination City *</label>
                  <input
                    type="text"
                    required
                    value={hotelForm.city}
                    onChange={(e) => setHotelForm({ ...hotelForm, city: e.target.value })}
                    placeholder="e.g. Goa, Coorg, Jaipur"
                    className="w-full px-3 py-2.5 rounded-xl border border-[#94A3B8]/60 text-xs font-semibold focus:ring-2 focus:ring-[#C25E34] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#0F172A] mb-1">Address &amp; Landmark *</label>
                  <input
                    type="text"
                    required
                    value={hotelForm.address}
                    onChange={(e) => setHotelForm({ ...hotelForm, address: e.target.value })}
                    placeholder="e.g. Madikeri Hill Road"
                    className="w-full px-3 py-2.5 rounded-xl border border-[#94A3B8]/60 text-xs font-semibold focus:ring-2 focus:ring-[#C25E34] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#0F172A] mb-1">Base Price / Night (₹) *</label>
                  <input
                    type="number"
                    required
                    value={hotelForm.basePrice}
                    onChange={(e) => setHotelForm({ ...hotelForm, basePrice: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#94A3B8]/60 text-xs font-semibold focus:ring-2 focus:ring-[#C25E34] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#0F172A] mb-1">Offer Rate / Night (₹) *</label>
                  <input
                    type="number"
                    required
                    value={hotelForm.discountedPrice}
                    onChange={(e) => setHotelForm({ ...hotelForm, discountedPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#94A3B8]/60 text-xs font-semibold focus:ring-2 focus:ring-[#C25E34] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#0F172A] mb-1">Key Amenities</label>
                <input
                  type="text"
                  value={hotelForm.amenities}
                  onChange={(e) => setHotelForm({ ...hotelForm, amenities: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#94A3B8]/60 text-xs font-semibold focus:ring-2 focus:ring-[#C25E34] outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#0F172A] mb-1">Cover Image URL</label>
                <input
                  type="text"
                  value={hotelForm.imageUrl}
                  onChange={(e) => setHotelForm({ ...hotelForm, imageUrl: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#94A3B8]/60 text-xs font-semibold focus:ring-2 focus:ring-[#C25E34] outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsPropertyModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#94A3B8] text-xs font-bold text-[#0F172A] hover:bg-[#F4F6F8]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-search-gradient px-6 py-2.5 rounded-xl text-xs font-bold text-white shadow-md cursor-pointer"
                >
                  Submit Property for Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD VEHICLE MODAL */}
      {isVehicleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-[#94A3B8]/40 overflow-hidden my-8">
            <div className="bg-[#0F172A] p-6 text-white flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black font-sans font-black">Add Commercial Cab to Fleet</h3>
                <p className="text-xs text-[#94A3B8]">Vehicle details and chauffeur allocation</p>
              </div>
              <button
                onClick={() => setIsVehicleModalOpen(false)}
                className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="h-4 w-4 text-white" />
              </button>
            </div>

            <form onSubmit={handleAddVehicle} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#0F172A] mb-1">Vehicle Category *</label>
                  <select
                    value={cabForm.category}
                    onChange={(e) => setCabForm({ ...cabForm, category: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#94A3B8]/60 text-xs font-semibold focus:ring-2 focus:ring-[#C25E34] outline-none"
                  >
                    <option value="SEDAN">Sedan (Dzire / Etios)</option>
                    <option value="SUV">SUV (Ertiga / XUV)</option>
                    <option value="INNOVA_CRYSTA">Toyota Innova Crysta</option>
                    <option value="LUXURY_MERCEDES">Mercedes-Benz E-Class</option>
                    <option value="HATCHBACK">Hatchback (Wagon R)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#0F172A] mb-1">Registration Number *</label>
                  <input
                    type="text"
                    required
                    value={cabForm.registrationNumber}
                    onChange={(e) => setCabForm({ ...cabForm, registrationNumber: e.target.value })}
                    placeholder="e.g. DL 01 AB 8899"
                    className="w-full px-3 py-2.5 rounded-xl border border-[#94A3B8]/60 text-xs font-semibold font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#0F172A] mb-1">Model Name *</label>
                <input
                  type="text"
                  required
                  value={cabForm.name}
                  onChange={(e) => setCabForm({ ...cabForm, name: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#94A3B8]/60 text-xs font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#0F172A] mb-1">Chauffeur Name *</label>
                  <input
                    type="text"
                    required
                    value={cabForm.driverName}
                    onChange={(e) => setCabForm({ ...cabForm, driverName: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#94A3B8]/60 text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#0F172A] mb-1">Chauffeur Contact Phone *</label>
                  <input
                    type="tel"
                    required
                    value={cabForm.driverPhone}
                    onChange={(e) => setCabForm({ ...cabForm, driverPhone: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#94A3B8]/60 text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-[#0F172A] mb-1">Base Rate / Km (₹) *</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={cabForm.baseFarePerKm}
                    onChange={(e) => setCabForm({ ...cabForm, baseFarePerKm: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#94A3B8]/60 text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#0F172A] mb-1">Seat Capacity</label>
                  <input
                    type="number"
                    value={cabForm.seatCapacity}
                    onChange={(e) => setCabForm({ ...cabForm, seatCapacity: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#94A3B8]/60 text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#0F172A] mb-1">Night Allowance (₹)</label>
                  <input
                    type="number"
                    value={cabForm.driverAllowance}
                    onChange={(e) => setCabForm({ ...cabForm, driverAllowance: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#94A3B8]/60 text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsVehicleModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#94A3B8] text-xs font-bold text-[#0F172A] hover:bg-[#F4F6F8]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-amber-600 hover:bg-amber-700 px-6 py-2.5 rounded-xl text-xs font-bold text-white shadow-md cursor-pointer transition-colors"
                >
                  Register Cab to Fleet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
