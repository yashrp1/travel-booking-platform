'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  Bus,
  Trash2,
  Hotel,
  Car,
  Users,
  CreditCard,
  ShieldAlert,
  ArrowUpRight,
  Sparkles,
  BarChart3,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  ToggleLeft,
  ToggleRight,
  Eye,
  LogOut,
  ShieldCheck,
  Building2,
  Tag,
  Plus,
  Percent,
} from 'lucide-react';
import { apiClient } from '@/lib/api-client';

export default function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('admin@wanderstay.com');
  const [password, setPassword] = useState('SuperAdmin@2026');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'APPROVALS' | 'PROPERTIES' | 'FLEET' | 'BUSES' | 'BOOKINGS' | 'COUPONS'>('OVERVIEW');

  // Dashboard Data State
  const [overview, setOverview] = useState<any>(null);
  const [pendingApprovals, setPendingApprovals] = useState<{ properties: any[]; vehicles: any[]; totalPending: number }>({
    properties: [],
    vehicles: [],
    totalPending: 0,
  });
  const [allProperties, setAllProperties] = useState<any[]>([]);
  const [allVehicles, setAllVehicles] = useState<any[]>([]);
  const [allBuses, setAllBuses] = useState<any[]>([]);
  const [isCreateBusOpen, setIsCreateBusOpen] = useState(false);
  const [newBus, setNewBus] = useState({
    operatorName: '',
    busType: 'BharatBenz AC Sleeper (2+1)',
    fromCity: '',
    toCity: '',
    departureTime: '08:30 PM',
    arrivalTime: '07:30 AM',
    duration: '11h 00m',
    fare: 1250,
    availableSeats: 24,
    amenities: 'Live Tracking, Clean Blanket, Charging Point, Free WiFi',
    registrationNumber: 'DL 01 AB 9920',
  });
  const [allBookings, setAllBookings] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [isCreateCouponOpen, setIsCreateCouponOpen] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    title: '',
    discountType: 'FLAT',
    discountValue: 2000,
    category: 'HOTEL',
    minBookingAmount: 5000,
    validDays: 30,
  });
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Check saved session or auto-login
  useEffect(() => {
    const savedToken = typeof window !== 'undefined' ? localStorage.getItem('wanderstay_admin_token') : null;
    if (savedToken) {
      setIsAuthenticated(true);
      loadAllAdminData();
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoading(true);
    try {
      const res = await apiClient.adminLogin({ email, password });
      if (res.token) {
        localStorage.setItem('wanderstay_admin_token', res.token);
        setIsAuthenticated(true);
        await loadAllAdminData();
      }
    } catch (err: any) {
      setLoginError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('wanderstay_admin_token');
    setIsAuthenticated(false);
  };

  const loadAllAdminData = async () => {
    setLoading(true);
    try {
      const [ov, pending, props, vehs, bks, cps, bss] = await Promise.all([
        apiClient.getAdminOverview(),
        apiClient.getAdminPendingApprovals(),
        apiClient.getAdminProperties(),
        apiClient.getAdminVehicles(),
        apiClient.getAdminBookings(),
        apiClient.getAdminCoupons(),
        apiClient.getAdminBuses(),
      ]);

      if (bss) setAllBuses(bss);

      if (ov) setOverview(ov);
      if (pending) setPendingApprovals(pending);
      if (props) setAllProperties(props);
      if (vehs) setAllVehicles(vehs);
      if (bks) setAllBookings(bks);
      if (cps) setCoupons(cps);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDecision = async (type: 'PROPERTY' | 'VEHICLE', id: string, decision: 'APPROVE' | 'REJECT') => {
    try {
      const res = await apiClient.submitApprovalDecision({ type, id, decision });
      setActionFeedback(res.message);
      setTimeout(() => setActionFeedback(null), 4500);
      await loadAllAdminData();
    } catch (err: any) {
      alert('Error updating decision: ' + err.message);
    }
  };

  const handleToggleProperty = async (id: string) => {
    try {
      const res = await apiClient.toggleAdminProperty(id);
      setActionFeedback(res.message);
      setTimeout(() => setActionFeedback(null), 4500);
      await loadAllAdminData();
    } catch (err: any) {
      alert('Error toggling property: ' + err.message);
    }
  };

  const handleToggleBus = async (id: string) => {
    try {
      const res = await apiClient.toggleAdminBus(id);
      setActionFeedback(res.message);
      setTimeout(() => setActionFeedback(null), 4500);
      await loadAllAdminData();
    } catch (err: any) {
      alert('Error toggling bus: ' + err.message);
    }
  };

  const handleDeleteBus = async (id: string) => {
    if (!confirm('Are you sure you want to delete this bus route?')) return;
    try {
      const res = await apiClient.deleteAdminBus(id);
      setActionFeedback(res.message);
      setTimeout(() => setActionFeedback(null), 4500);
      await loadAllAdminData();
    } catch (err: any) {
      alert('Error deleting bus: ' + err.message);
    }
  };

  const handleCreateBus = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await apiClient.createAdminBus({
        ...newBus,
        amenities: newBus.amenities.split(',').map((s) => s.trim()).filter(Boolean),
        boardingPoints: [`Main ISBT ${newBus.fromCity}`, `Highway Toll Plaza`],
        droppingPoints: [`Central Bus Station ${newBus.toCity}`],
      });
      setActionFeedback(res.message);
      setTimeout(() => setActionFeedback(null), 4500);
      setIsCreateBusOpen(false);
      setNewBus({
        operatorName: '',
        busType: 'BharatBenz AC Sleeper (2+1)',
        fromCity: '',
        toCity: '',
        departureTime: '08:30 PM',
        arrivalTime: '07:30 AM',
        duration: '11h 00m',
        fare: 1250,
        availableSeats: 24,
        amenities: 'Live Tracking, Clean Blanket, Charging Point, Free WiFi',
        registrationNumber: 'DL 01 AB 9920',
      });
      await loadAllAdminData();
    } catch (err: any) {
      alert('Error creating bus: ' + err.message);
    }
  };

  const handleToggleVehicle = async (id: string) => {
    try {
      const res = await apiClient.toggleAdminVehicle(id);
      setActionFeedback(res.message);
      setTimeout(() => setActionFeedback(null), 4500);
      await loadAllAdminData();
    } catch (err: any) {
      alert('Error toggling vehicle: ' + err.message);
    }
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.createAdminCoupon({
        code: newCoupon.code.toUpperCase(),
        title: newCoupon.title,
        discountType: newCoupon.discountType,
        discountValue: Number(newCoupon.discountValue),
        category: newCoupon.category,
        minBookingAmount: Number(newCoupon.minBookingAmount),
        validDays: Number(newCoupon.validDays),
      });
      setActionFeedback(`Campaign coupon "${newCoupon.code.toUpperCase()}" launched successfully!`);
      setIsCreateCouponOpen(false);
      setNewCoupon({
        code: '',
        title: '',
        discountType: 'FLAT',
        discountValue: 2000,
        category: 'HOTEL',
        minBookingAmount: 5000,
        validDays: 30,
      });
      const updated = await apiClient.getAdminCoupons();
      setCoupons(updated);
      setTimeout(() => setActionFeedback(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to create coupon');
    }
  };

  // If not logged in, render the secure Super Admin Login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F4F6F8] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[#94A3B8]/40 overflow-hidden">
          {/* Header */}
          <div className="bg-[#0F172A] p-8 text-center text-[#F4F6F8] relative">
            <div className="h-14 w-14 mx-auto rounded-2xl bg-gradient-to-tr from-[#C25E34] via-[#0084FF] to-[#94A3B8] flex items-center justify-center mb-3 shadow-lg">
              <ShieldCheck className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-xl font-black font-sans font-black tracking-tight">WanderStay Super Admin</h1>
            <p className="text-xs text-[#94A3B8] mt-1">Platform Operations, Supplier Verification &amp; Marketplace Control</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="p-8 space-y-5">
            {loginError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                <XCircle className="h-4 w-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-1">
                Admin Master Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#94A3B8]/60 text-sm font-semibold text-[#0F172A] focus:ring-2 focus:ring-[#C25E34] outline-none"
                placeholder="admin@wanderstay.com"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-1">
                Master Security Key
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#94A3B8]/60 text-sm font-semibold text-[#0F172A] focus:ring-2 focus:ring-[#C25E34] outline-none"
                placeholder="••••••••••••"
              />
            </div>

            <div className="p-3.5 bg-[#F4F6F8] rounded-xl border border-[#94A3B8]/40 text-xs text-[#0F172A]/80">
              <p className="font-bold text-[#C25E34]">🔑 Launch Credentials Pre-Loaded:</p>
              <p className="mt-0.5 text-[11px]">Email: <span className="font-mono font-bold">admin@wanderstay.com</span></p>
              <p className="text-[11px]">Password: <span className="font-mono font-bold">SuperAdmin@2026</span></p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-search-gradient text-white py-3.5 rounded-xl font-bold text-sm tracking-wide shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              {loading ? 'Authenticating...' : 'Enter Super Admin Console'}
            </button>

            <div className="text-center">
              <Link href="/" className="text-xs font-semibold text-[#C25E34] hover:underline">
                &larr; Return to Public Guest Website
              </Link>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Authenticated Super Admin Dashboard
  return (
    <div className="min-h-screen bg-[#F4F6F8] text-[#0F172A]">
      {/* Top Admin Navigation */}
      <header className="sticky top-0 z-40 bg-[#0F172A] text-[#F4F6F8] shadow-md border-b border-[#3D3532]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-[#C25E34] via-[#0084FF] to-[#94A3B8] flex items-center justify-center font-black shadow-md">
                <ShieldCheck className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-black font-sans font-black tracking-tight text-white">
                    Wander<span className="text-[#C25E34] italic">Stay</span>
                  </span>
                  <span className="rounded bg-[#C25E34] text-[#18181B] px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-white">
                    SUPER ADMIN
                  </span>
                </div>
                <p className="text-[10px] text-[#94A3B8]">Executive Operations &amp; Marketplace Quality Control</p>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="hidden sm:flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 border border-[#3D3532] text-[#94A3B8]">
              <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></span>
              <span>Logged in: <strong className="text-white">Chief Operations Officer</strong></span>
            </div>

            <Link
              href="/"
              target="_blank"
              className="rounded-lg bg-white/10 hover:bg-white/20 px-3 py-1.5 font-bold text-white transition-colors flex items-center gap-1"
            >
              <span>Live Website</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>

            <button
              onClick={handleLogout}
              className="rounded-lg bg-red-600/80 hover:bg-red-600 px-3 py-1.5 font-bold text-white transition-colors flex items-center gap-1 cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="border-t border-[#3D3532] bg-[#1E1A19]">
          <div className="mx-auto flex max-w-7xl items-center gap-2 sm:gap-6 px-4 sm:px-6 lg:px-8 py-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('OVERVIEW')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'OVERVIEW' ? 'bg-[#C25E34] text-[#18181B] text-white' : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              Executive Overview
            </button>
            <button
              onClick={() => setActiveTab('APPROVALS')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'APPROVALS' ? 'bg-[#C25E34] text-[#18181B] text-white' : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              <span>Pending Approvals Queue</span>
              {pendingApprovals.totalPending > 0 && (
                <span className="bg-amber-400 text-black px-1.5 py-0.2 rounded-full text-[10px] font-black">
                  {pendingApprovals.totalPending}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('PROPERTIES')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'PROPERTIES' ? 'bg-[#C25E34] text-[#18181B] text-white' : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              Properties &amp; Stays Catalog ({allProperties.length})
            </button>
            <button
              onClick={() => setActiveTab('FLEET')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'FLEET' ? 'bg-[#C25E34] text-[#18181B] text-white' : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              Cab Fleet Catalog ({allVehicles.length})
            </button>
            <button
              onClick={() => setActiveTab('BUSES')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'BUSES' ? 'bg-[#C25E34] text-[#18181B] text-white' : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              <Bus className="h-3.5 w-3.5" />
              Bus Services Catalog ({allBuses.length})
            </button>
            <button
              onClick={() => setActiveTab('BOOKINGS')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'BOOKINGS' ? 'bg-[#C25E34] text-[#18181B] text-white' : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              Live Bookings ({allBookings.length})
            </button>
            <button
              onClick={() => setActiveTab('COUPONS')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'COUPONS' ? 'bg-[#C25E34] text-[#18181B] text-white' : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              <Tag className="h-3.5 w-3.5" />
              <span>Promotions &amp; Coupons ({coupons.length})</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Action Feedback Banner */}
        {actionFeedback && (
          <div className="p-4 bg-stone-200 border border-stone-300 text-stone-900 rounded-2xl flex items-center gap-3 shadow-md animate-fade-in">
            <CheckCircle2 className="h-5 w-5 text-amber-500 shrink-0" />
            <p className="text-xs font-bold">{actionFeedback}</p>
          </div>
        )}

        {/* TAB 1: EXECUTIVE OVERVIEW */}
        {activeTab === 'OVERVIEW' && (
          <div className="space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="rounded-3xl bg-white border border-[#94A3B8]/40 p-6 shadow-sm">
                <div className="flex items-center justify-between text-xs text-[#0F172A]/70 font-bold mb-2">
                  <span>Gross Merchandise Value (GMV)</span>
                  <TrendingUp className="h-4 w-4 text-amber-500" />
                </div>
                <div className="text-3xl font-black font-sans font-black text-[#0F172A]">
                  ₹{(overview?.metrics?.gmv || 18530).toLocaleString('en-IN')}
                </div>
                <span className="text-[11px] text-stone-700 font-bold mt-1 block">Live verified guest bookings</span>
              </div>

              <div className="rounded-3xl bg-white border border-[#94A3B8]/40 p-6 shadow-sm">
                <div className="flex items-center justify-between text-xs text-[#0F172A]/70 font-bold mb-2">
                  <span>Platform Commission (15%)</span>
                  <CreditCard className="h-4 w-4 text-[#C25E34]" />
                </div>
                <div className="text-3xl font-black font-sans font-black text-[#C25E34]">
                  ₹{(overview?.metrics?.platformCommission || 2780).toLocaleString('en-IN')}
                </div>
                <span className="text-[11px] text-[#C25E34] font-bold mt-1 block">Net marketplace take rate</span>
              </div>

              <div className="rounded-3xl bg-white border border-[#94A3B8]/40 p-6 shadow-sm">
                <div className="flex items-center justify-between text-xs text-[#0F172A]/70 font-bold mb-2">
                  <span>Accommodations Registered</span>
                  <Hotel className="h-4 w-4 text-[#C25E34]" />
                </div>
                <div className="text-3xl font-black font-sans font-black text-[#0F172A]">
                  {allProperties.length} Stays
                </div>
                <span className="text-[11px] text-amber-700 font-bold mt-1 block">
                  {allProperties.filter((p) => p.status === 'ACTIVE').length} Active | {allProperties.filter((p) => p.status === 'PENDING_APPROVAL').length} Pending
                </span>
              </div>

              <div className="rounded-3xl bg-white border border-[#94A3B8]/40 p-6 shadow-sm">
                <div className="flex items-center justify-between text-xs text-[#0F172A]/70 font-bold mb-2">
                  <span>Commercial Cabs Registered</span>
                  <Car className="h-4 w-4 text-[#C25E34]" />
                </div>
                <div className="text-3xl font-black font-sans font-black text-[#0F172A]">
                  {allVehicles.length} Vehicles
                </div>
                <span className="text-[11px] text-amber-700 font-bold mt-1 block">
                  {allVehicles.filter((v) => v.status === 'ACTIVE').length} Active | {allVehicles.filter((v) => v.status === 'PENDING_APPROVAL').length} Pending
                </span>
              </div>
            </div>

            {/* Quality Inspection Action Card */}
            {pendingApprovals.totalPending > 0 && (
              <div className="rounded-3xl bg-gradient-to-r from-[#C25E34] via-[#0084FF] to-[#0F172A] p-6 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-400 animate-ping"></span>
                    <h3 className="text-base font-bold font-sans font-black">
                      {pendingApprovals.totalPending} New Supplier Listings Awaiting Quality Approval
                    </h3>
                  </div>
                  <p className="text-xs text-[#F4F6F8]/80">
                    Hotels, homestays, and cab operators have submitted inventory. Review their amenities, pricing, and licenses before releasing them live.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('APPROVALS')}
                  className="rounded-xl bg-white text-[#0F172A] px-5 py-2.5 text-xs font-black shadow-md hover:bg-[#F4F6F8] transition-colors shrink-0 cursor-pointer"
                >
                  Inspect &amp; Approve Listings &rarr;
                </button>
              </div>
            )}

            {/* Inventory Breakdown by Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-3xl bg-white border border-[#94A3B8]/40 p-6 shadow-sm">
                <h3 className="text-sm font-bold text-[#0F172A] mb-4 flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-[#C25E34]" />
                  <span>Stays Breakdown by Property Type</span>
                </h3>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-[#F4F6F8] rounded-xl border border-[#94A3B8]/30">
                    <span className="text-gray-500 block">Hotels</span>
                    <strong className="text-base font-sans font-black font-bold text-[#0F172A]">
                      {allProperties.filter((p) => p.propertyType === 'HOTEL').length}
                    </strong>
                  </div>
                  <div className="p-3 bg-[#F4F6F8] rounded-xl border border-[#94A3B8]/30">
                    <span className="text-gray-500 block">Resorts &amp; Spas</span>
                    <strong className="text-base font-sans font-black font-bold text-[#0F172A]">
                      {allProperties.filter((p) => p.propertyType === 'RESORT').length}
                    </strong>
                  </div>
                  <div className="p-3 bg-[#F4F6F8] rounded-xl border border-[#94A3B8]/30">
                    <span className="text-gray-500 block">Homestays</span>
                    <strong className="text-base font-sans font-black font-bold text-[#0F172A]">
                      {allProperties.filter((p) => p.propertyType === 'HOMESTAY').length}
                    </strong>
                  </div>
                  <div className="p-3 bg-[#F4F6F8] rounded-xl border border-[#94A3B8]/30">
                    <span className="text-gray-500 block">Luxury Villas</span>
                    <strong className="text-base font-sans font-black font-bold text-[#0F172A]">
                      {allProperties.filter((p) => p.propertyType === 'VILLA').length}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl bg-white border border-[#94A3B8]/40 p-6 shadow-sm">
                <h3 className="text-sm font-bold text-[#0F172A] mb-4 flex items-center gap-2">
                  <Car className="h-4 w-4 text-[#C25E34]" />
                  <span>Fleet Breakdown by Vehicle Class</span>
                </h3>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-[#F4F6F8] rounded-xl border border-[#94A3B8]/30">
                    <span className="text-gray-500 block">Sedan (Dzire / Etios)</span>
                    <strong className="text-base font-sans font-black font-bold text-[#0F172A]">
                      {allVehicles.filter((v) => v.category === 'SEDAN').length}
                    </strong>
                  </div>
                  <div className="p-3 bg-[#F4F6F8] rounded-xl border border-[#94A3B8]/30">
                    <span className="text-gray-500 block">SUV / Innova Crysta</span>
                    <strong className="text-base font-sans font-black font-bold text-[#0F172A]">
                      {allVehicles.filter((v) => v.category === 'SUV' || v.category === 'INNOVA_CRYSTA').length}
                    </strong>
                  </div>
                  <div className="p-3 bg-[#F4F6F8] rounded-xl border border-[#94A3B8]/30">
                    <span className="text-gray-500 block">Luxury (Mercedes / Audi)</span>
                    <strong className="text-base font-sans font-black font-bold text-[#0F172A]">
                      {allVehicles.filter((v) => v.category === 'LUXURY_MERCEDES' || v.category === 'LUXURY').length}
                    </strong>
                  </div>
                  <div className="p-3 bg-[#F4F6F8] rounded-xl border border-[#94A3B8]/30">
                    <span className="text-gray-500 block">Hatchback / City</span>
                    <strong className="text-base font-sans font-black font-bold text-[#0F172A]">
                      {allVehicles.filter((v) => v.category === 'HATCHBACK').length}
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PENDING APPROVALS QUEUE */}
        {activeTab === 'APPROVALS' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black font-sans font-black text-[#0F172A]">Pending Supplier Quality Approvals</h2>
                <p className="text-xs text-gray-600">Review supplier inventory before making it live to public guests.</p>
              </div>
              <button
                onClick={loadAllAdminData}
                className="px-3 py-1.5 rounded-lg border border-[#94A3B8] text-xs font-bold text-[#0F172A] hover:bg-white"
              >
                Refresh Queue
              </button>
            </div>

            {pendingApprovals.totalPending === 0 ? (
              <div className="rounded-3xl bg-white border border-[#94A3B8]/40 p-12 text-center">
                <CheckCircle2 className="h-12 w-12 text-amber-500 mx-auto mb-3" />
                <h3 className="text-base font-bold font-sans font-black text-[#0F172A]">All Caught Up!</h3>
                <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto">
                  There are no pending property or vehicle submissions awaiting review. Any new submission from the Partner or Operator extranet will instantly appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Pending Properties */}
                {pendingApprovals.properties.length > 0 && (
                  <div className="rounded-3xl bg-white border border-[#94A3B8]/40 overflow-hidden shadow-sm">
                    <div className="p-4 bg-[#0F172A] text-white flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Hotel className="h-4 w-4 text-[#C25E34]" />
                        <h3 className="text-xs font-bold uppercase tracking-wider">
                          Properties Awaiting Sign-off ({pendingApprovals.properties.length})
                        </h3>
                      </div>
                    </div>

                    <div className="divide-y divide-[#94A3B8]/20">
                      {pendingApprovals.properties.map((prop) => (
                        <div key={prop.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <img
                              src={prop.imageUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=300'}
                              alt={prop.name}
                              className="h-20 w-24 rounded-2xl object-cover shrink-0 border border-[#94A3B8]/30"
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 rounded bg-[#C25E34] text-[#18181B]/10 text-[#C25E34] text-[10px] font-black uppercase">
                                  {prop.propertyType}
                                </span>
                                <span className="text-xs font-bold text-gray-500">{prop.city}</span>
                                <span className="text-amber-500 text-xs font-bold">★ {prop.starRating || 5}</span>
                              </div>
                              <h4 className="text-sm font-bold text-[#0F172A] mt-1 font-sans font-black">{prop.name}</h4>
                              <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{prop.address}</p>
                              <div className="flex items-center gap-3 mt-2 text-[11px] text-gray-600">
                                <span>Supplier: <strong className="text-[#0F172A]">{prop.partnerName || 'Independent Host'}</strong></span>
                                <span>•</span>
                                <span>Rate: <strong className="text-[#C25E34]">₹{prop.discountedPrice || prop.basePrice}/night</strong></span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => handleDecision('PROPERTY', prop.id, 'APPROVE')}
                              className="px-4 py-2 bg-amber-500 hover:bg-stone-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                              <span>Approve &amp; Launch Live</span>
                            </button>
                            <button
                              onClick={() => handleDecision('PROPERTY', prop.id, 'REJECT')}
                              className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                            >
                              <XCircle className="h-4 w-4" />
                              <span>Reject</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Pending Vehicles */}
                {pendingApprovals.vehicles.length > 0 && (
                  <div className="rounded-3xl bg-white border border-[#94A3B8]/40 overflow-hidden shadow-sm">
                    <div className="p-4 bg-[#0F172A] text-white flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Car className="h-4 w-4 text-[#C25E34]" />
                        <h3 className="text-xs font-bold uppercase tracking-wider">
                          Commercial Cabs Awaiting Sign-off ({pendingApprovals.vehicles.length})
                        </h3>
                      </div>
                    </div>

                    <div className="divide-y divide-[#94A3B8]/20">
                      {pendingApprovals.vehicles.map((veh) => (
                        <div key={veh.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <img
                              src={veh.imageUrl || 'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=300'}
                              alt={veh.name}
                              className="h-20 w-24 rounded-2xl object-cover shrink-0 border border-[#94A3B8]/30"
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 rounded bg-[#C25E34] text-[#18181B]/10 text-[#C25E34] text-[10px] font-black uppercase">
                                  {veh.category}
                                </span>
                                <span className="text-xs font-bold font-mono text-gray-700 bg-gray-100 px-1.5 py-0.2 rounded">
                                  {veh.registrationNumber}
                                </span>
                              </div>
                              <h4 className="text-sm font-bold text-[#0F172A] mt-1 font-sans font-black">{veh.name}</h4>
                              <p className="text-xs text-gray-500 mt-0.5">Assigned Chauffeur: {veh.driverName} ({veh.driverPhone})</p>
                              <div className="flex items-center gap-3 mt-2 text-[11px] text-gray-600">
                                <span>Operator: <strong className="text-[#0F172A]">{veh.operatorName}</strong></span>
                                <span>•</span>
                                <span>Base Rate: <strong className="text-[#C25E34]">₹{veh.baseFarePerKm}/km</strong></span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => handleDecision('VEHICLE', veh.id, 'APPROVE')}
                              className="px-4 py-2 bg-amber-500 hover:bg-stone-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                              <span>Approve Chauffeur</span>
                            </button>
                            <button
                              onClick={() => handleDecision('VEHICLE', veh.id, 'REJECT')}
                              className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                            >
                              <XCircle className="h-4 w-4" />
                              <span>Reject</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: PROPERTIES & STAYS MASTER CATALOG */}
        {activeTab === 'PROPERTIES' && (
          <div className="rounded-3xl bg-white border border-[#94A3B8]/40 overflow-hidden shadow-sm">
            <div className="p-5 border-b border-[#94A3B8]/30 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold font-sans font-black text-[#0F172A]">Marketplace Accommodations Catalog</h2>
                <p className="text-xs text-gray-500">Enable, suspend, or audit all live and pending properties.</p>
              </div>
              <span className="text-xs font-bold text-[#C25E34]">{allProperties.length} Total Registered</span>
            </div>

            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left">
                <thead className="bg-[#F4F6F8] text-gray-700 uppercase tracking-wider text-[10px] border-b border-[#94A3B8]/30">
                  <tr>
                    <th className="p-3.5">Property Details</th>
                    <th className="p-3.5">Type &amp; Rating</th>
                    <th className="p-3.5">City</th>
                    <th className="p-3.5">Price / Night</th>
                    <th className="p-3.5">Supplier / Partner</th>
                    <th className="p-3.5">Marketplace Status</th>
                    <th className="p-3.5 text-right">Switch Live Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#94A3B8]/20">
                  {allProperties.map((p) => (
                    <tr key={p.id} className="hover:bg-[#F4F6F8]/50 transition-colors">
                      <td className="p-3.5">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.imageUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=100'}
                            alt={p.name}
                            className="h-10 w-12 rounded-lg object-cover"
                          />
                          <div>
                            <strong className="text-[#0F172A] block font-sans font-black text-sm">{p.name}</strong>
                            <span className="text-[10px] text-gray-400 font-mono">ID: {p.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded bg-[#C25E34] text-[#18181B]/10 text-[#C25E34] font-bold text-[10px] block w-fit mb-0.5">
                          {p.propertyType || 'HOTEL'}
                        </span>
                        <span className="text-amber-600 font-bold">★ {p.starRating || 5}.0</span>
                      </td>
                      <td className="p-3.5 font-semibold text-[#0F172A]">{p.city}</td>
                      <td className="p-3.5 font-bold text-[#C25E34]">₹{p.discountedPrice || p.basePrice}</td>
                      <td className="p-3.5 text-gray-600 font-medium">{p.partnerName || 'WanderStay Direct'}</td>
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            p.status === 'ACTIVE'
                              ? 'bg-stone-200 text-stone-800'
                              : p.status === 'PENDING_APPROVAL'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {p.status || 'ACTIVE'}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => handleToggleProperty(p.id)}
                          className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                            p.status === 'ACTIVE'
                              ? 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                              : 'bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-200'
                          }`}
                        >
                          {p.status === 'ACTIVE' ? 'Suspend from Search' : 'Activate Live'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: FLEET CATALOG */}
        {activeTab === 'FLEET' && (
          <div className="rounded-3xl bg-white border border-[#94A3B8]/40 overflow-hidden shadow-sm">
            <div className="p-5 border-b border-[#94A3B8]/30 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold font-sans font-black text-[#0F172A]">Commercial Cab Fleet Catalog</h2>
                <p className="text-xs text-gray-500">Monitor vehicle readiness, chauffeur details, and rates.</p>
              </div>
              <span className="text-xs font-bold text-[#C25E34]">{allVehicles.length} Total Vehicles</span>
            </div>

            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left">
                <thead className="bg-[#F4F6F8] text-gray-700 uppercase tracking-wider text-[10px] border-b border-[#94A3B8]/30">
                  <tr>
                    <th className="p-3.5">Vehicle Model</th>
                    <th className="p-3.5">Registration</th>
                    <th className="p-3.5">Chauffeur</th>
                    <th className="p-3.5">Per-Km Base Rate</th>
                    <th className="p-3.5">Fleet Operator</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Toggle Active</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#94A3B8]/20">
                  {allVehicles.map((v) => (
                    <tr key={v.id} className="hover:bg-[#F4F6F8]/50 transition-colors">
                      <td className="p-3.5">
                        <strong className="text-[#0F172A] block font-sans font-black text-sm">{v.name}</strong>
                        <span className="text-[10px] text-gray-400 font-mono">Category: {v.category}</span>
                      </td>
                      <td className="p-3.5 font-mono font-bold text-gray-700">{v.registrationNumber}</td>
                      <td className="p-3.5">
                        <strong className="text-[#0F172A] block">{v.driverName}</strong>
                        <span className="text-[10px] text-gray-500">{v.driverPhone}</span>
                      </td>
                      <td className="p-3.5 font-bold text-[#C25E34]">₹{v.baseFarePerKm}/km</td>
                      <td className="p-3.5 text-gray-600 font-medium">{v.operatorName}</td>
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            v.status === 'ACTIVE'
                              ? 'bg-stone-200 text-stone-800'
                              : v.status === 'PENDING_APPROVAL'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {v.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => handleToggleVehicle(v.id)}
                          className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                            v.status === 'ACTIVE'
                              ? 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                              : 'bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-200'
                          }`}
                        >
                          {v.status === 'ACTIVE' ? 'Suspend Vehicle' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: LIVE BOOKINGS */}
        {activeTab === 'BOOKINGS' && (
          <div className="rounded-3xl bg-white border border-[#94A3B8]/40 overflow-hidden shadow-sm">
            <div className="p-5 border-b border-[#94A3B8]/30 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold font-sans font-black text-[#0F172A]">Marketplace Booking Stream</h2>
                <p className="text-xs text-gray-500">Real-time ledger of transactions across hotels and cabs.</p>
              </div>
              <span className="text-xs font-bold text-[#C25E34]">{allBookings.length} Total Bookings</span>
            </div>

            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left">
                <thead className="bg-[#F4F6F8] text-gray-700 uppercase tracking-wider text-[10px] border-b border-[#94A3B8]/30">
                  <tr>
                    <th className="p-3.5">Booking Ref</th>
                    <th className="p-3.5">Type</th>
                    <th className="p-3.5">Guest / Passenger</th>
                    <th className="p-3.5">Service Details</th>
                    <th className="p-3.5">Total Paid</th>
                    <th className="p-3.5">Platform Commission</th>
                    <th className="p-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#94A3B8]/20">
                  {allBookings.map((b) => (
                    <tr key={b.bookingReference} className="hover:bg-[#F4F6F8]/50 transition-colors">
                      <td className="p-3.5 font-mono font-bold text-[#0F172A]">{b.bookingReference}</td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded bg-[#C25E34] text-[#18181B]/10 text-[#C25E34] font-bold text-[10px]">
                          {b.category}
                        </span>
                      </td>
                      <td className="p-3.5 font-semibold text-[#0F172A]">{b.leadGuestName || b.passengerName || 'Verified Guest'}</td>
                      <td className="p-3.5">
                        <strong className="block text-[#0F172A]">{b.hotelName || b.cabName || 'Service'}</strong>
                        <span className="text-[10px] text-gray-500">
                          {b.category === 'HOTEL' ? `${b.checkInDate} to ${b.checkOutDate}` : `${b.fromCity} → ${b.toCity}`}
                        </span>
                      </td>
                      <td className="p-3.5 font-bold text-[#0F172A]">₹{Number(b.totalPayable).toLocaleString('en-IN')}</td>
                      <td className="p-3.5 font-bold text-[#C25E34]">
                        ₹{Math.round(Number(b.totalPayable) * 0.15).toLocaleString('en-IN')} (15%)
                      </td>
                      <td className="p-3.5">
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

        {/* TAB 6: CAMPAIGNS & COUPON GOVERNANCE (MMT Parity) */}
        {activeTab === 'COUPONS' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-[#94A3B8]/40 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#C25E34] block">
                  Promotions Engine • MakeMyTrip Parity
                </span>
                <h2 className="text-xl font-bold font-black text-[#0F172A]">
                  Marketing Campaigns &amp; Promo Codes
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Launch instant bank discounts, seasonal sales, and category-specific checkout vouchers
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsCreateCouponOpen(true)}
                className="btn-search-gradient px-4 py-2 text-xs font-bold text-white rounded-full shadow-md flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
              >
                <Plus className="h-4 w-4" />
                <span>Create New Campaign</span>
              </button>
            </div>

            {/* Coupons Table */}
            <div className="rounded-3xl bg-white border border-[#94A3B8]/40 overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F4F6F8] text-gray-700 uppercase tracking-wider text-[10px] border-b border-[#94A3B8]/30">
                  <tr>
                    <th className="p-3.5">Coupon Code</th>
                    <th className="p-3.5">Campaign Title</th>
                    <th className="p-3.5">Applicable Service</th>
                    <th className="p-3.5">Discount Offer</th>
                    <th className="p-3.5">Min Booking Value</th>
                    <th className="p-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#94A3B8]/20">
                  {coupons.map((c) => (
                    <tr key={c.code} className="hover:bg-[#F4F6F8]/50 transition-colors">
                      <td className="p-3.5">
                        <span className="font-mono font-black text-sm text-[#C25E34] bg-[#EFF6FF] px-2.5 py-1 rounded-lg border border-[#94A3B8]/40">
                          {c.code}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <strong className="block text-[#0F172A]">{c.title}</strong>
                        <span className="text-[10px] text-gray-500">{c.description || 'Public traveler promotion'}</span>
                      </td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded bg-[#0F172A] text-white font-bold text-[10px] uppercase">
                          {c.category || 'ALL'}
                        </span>
                      </td>
                      <td className="p-3.5 font-bold text-stone-700">
                        {c.discountType === 'PERCENT' ? `${c.discountValue}% OFF` : `₹${Number(c.discountValue).toLocaleString('en-IN')} FLAT OFF`}
                      </td>
                      <td className="p-3.5 text-gray-600">
                        ₹{Number(c.minBookingAmount || 0).toLocaleString('en-IN')}
                      </td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-200 text-stone-800">
                          {c.isActive ? 'ACTIVE' : 'EXPIRED'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}


        {/* CREATE BUS MODAL */}
        {isCreateBusOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-gray-200">
              <div className="flex items-center justify-between pb-3 border-b border-gray-200 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#C25E34]/10 text-[#C25E34] flex items-center justify-center">
                    <Bus className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-gray-900">Add New Bus Service</h3>
                    <p className="text-[11px] text-gray-500">Deploy an intercity bus route to customer app &amp; site</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsCreateBusOpen(false)}
                  className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 cursor-pointer"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateBus} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Bus Operator Brand Name</label>
                  <input
                    type="text"
                    required
                    value={newBus.operatorName}
                    onChange={(e) => setNewBus({ ...newBus, operatorName: e.target.value })}
                    placeholder="e.g. Zingbus Plus Luxury, IntrCity SmartBus"
                    className="w-full rounded-xl border border-gray-300 p-2.5 font-bold focus:border-[#C25E34] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">From City (Origin)</label>
                    <input
                      type="text"
                      required
                      value={newBus.fromCity}
                      onChange={(e) => setNewBus({ ...newBus, fromCity: e.target.value })}
                      placeholder="e.g. New Delhi"
                      className="w-full rounded-xl border border-gray-300 p-2.5 font-bold focus:border-[#C25E34] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">To City (Destination)</label>
                    <input
                      type="text"
                      required
                      value={newBus.toCity}
                      onChange={(e) => setNewBus({ ...newBus, toCity: e.target.value })}
                      placeholder="e.g. Manali"
                      className="w-full rounded-xl border border-gray-300 p-2.5 font-bold focus:border-[#C25E34] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Coach / Chassis Type</label>
                  <select
                    value={newBus.busType}
                    onChange={(e) => setNewBus({ ...newBus, busType: e.target.value })}
                    className="w-full rounded-xl border border-gray-300 p-2.5 font-bold bg-[#F8FAFC] focus:border-[#C25E34] focus:outline-none"
                  >
                    <option value="BharatBenz AC Sleeper (2+1)">BharatBenz AC Sleeper (2+1)</option>
                    <option value="Volvo 9600 Multi-Axle AC Sleeper">Volvo 9600 Multi-Axle AC Sleeper</option>
                    <option value="Scania High-Deck AC Sleeper (2+1)">Scania High-Deck AC Sleeper (2+1)</option>
                    <option value="Volvo B11R AC Semi-Sleeper (2+2)">Volvo B11R AC Semi-Sleeper (2+2)</option>
                    <option value="Irizar i6 AC Luxury Sleeper">Irizar i6 AC Luxury Sleeper</option>
                  </select>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Departure</label>
                    <input
                      type="text"
                      required
                      value={newBus.departureTime}
                      onChange={(e) => setNewBus({ ...newBus, departureTime: e.target.value })}
                      placeholder="08:30 PM"
                      className="w-full rounded-xl border border-gray-300 p-2.5 font-bold focus:border-[#C25E34] focus:outline-none text-center"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Arrival</label>
                    <input
                      type="text"
                      required
                      value={newBus.arrivalTime}
                      onChange={(e) => setNewBus({ ...newBus, arrivalTime: e.target.value })}
                      placeholder="07:30 AM"
                      className="w-full rounded-xl border border-gray-300 p-2.5 font-bold focus:border-[#C25E34] focus:outline-none text-center"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Duration</label>
                    <input
                      type="text"
                      required
                      value={newBus.duration}
                      onChange={(e) => setNewBus({ ...newBus, duration: e.target.value })}
                      placeholder="11h 00m"
                      className="w-full rounded-xl border border-gray-300 p-2.5 font-bold focus:border-[#C25E34] focus:outline-none text-center"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">One-Way Fare (₹)</label>
                    <input
                      type="number"
                      required
                      value={newBus.fare}
                      onChange={(e) => setNewBus({ ...newBus, fare: Number(e.target.value) })}
                      className="w-full rounded-xl border border-gray-300 p-2.5 font-bold text-[#C25E34] focus:border-[#C25E34] focus:outline-none text-base"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Total Available Berths</label>
                    <input
                      type="number"
                      required
                      value={newBus.availableSeats}
                      onChange={(e) => setNewBus({ ...newBus, availableSeats: Number(e.target.value) })}
                      className="w-full rounded-xl border border-gray-300 p-2.5 font-bold focus:border-[#C25E34] focus:outline-none text-base"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Amenities (Comma separated)</label>
                  <input
                    type="text"
                    value={newBus.amenities}
                    onChange={(e) => setNewBus({ ...newBus, amenities: e.target.value })}
                    placeholder="Live Tracking, Clean Blanket, Charging Point, Free WiFi"
                    className="w-full rounded-xl border border-gray-300 p-2.5 text-xs focus:border-[#C25E34] focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setIsCreateBusOpen(false)}
                    className="px-4 py-2 rounded-full border border-gray-300 font-bold text-gray-700 hover:bg-gray-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-search-gradient px-6 py-2 rounded-full font-bold uppercase tracking-wider text-white shadow-md cursor-pointer"
                  >
                    Publish Bus Route
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* CREATE COUPON MODAL */}
        {isCreateCouponOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#C25E34] block">
                    CAMPAIGN BUILDER
                  </span>
                  <h3 className="text-xl font-bold font-black text-[#0F172A]">
                    Launch New Coupon Offer
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCreateCouponOpen(false)}
                  className="p-1.5 rounded-full hover:bg-neutral-100 cursor-pointer text-[#877B76]"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-[#877B76] mb-1">Coupon Code</label>
                  <input
                    type="text"
                    required
                    value={newCoupon.code}
                    onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                    placeholder="e.g. FESTIVE2026"
                    className="w-full rounded-xl border border-[#CBD5E1] p-2.5 font-mono font-bold uppercase focus:border-[#C25E34] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#877B76] mb-1">Campaign Headline</label>
                  <input
                    type="text"
                    required
                    value={newCoupon.title}
                    onChange={(e) => setNewCoupon({ ...newCoupon, title: e.target.value })}
                    placeholder="e.g. Festival Season Luxury Pass"
                    className="w-full rounded-xl border border-[#CBD5E1] p-2.5 font-medium focus:border-[#C25E34] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-[#877B76] mb-1">Discount Type</label>
                    <select
                      value={newCoupon.discountType}
                      onChange={(e) => setNewCoupon({ ...newCoupon, discountType: e.target.value })}
                      className="w-full rounded-xl border border-[#CBD5E1] p-2.5 font-bold focus:border-[#C25E34] focus:outline-none bg-[#F8FAFC]"
                    >
                      <option value="FLAT">Flat ₹ Discount</option>
                      <option value="PERCENT">Percentage (%)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#877B76] mb-1">Discount Value</label>
                    <input
                      type="number"
                      required
                      value={newCoupon.discountValue}
                      onChange={(e) => setNewCoupon({ ...newCoupon, discountValue: Number(e.target.value) })}
                      className="w-full rounded-xl border border-[#CBD5E1] p-2.5 font-bold focus:border-[#C25E34] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-[#877B76] mb-1">Target Category</label>
                    <select
                      value={newCoupon.category}
                      onChange={(e) => setNewCoupon({ ...newCoupon, category: e.target.value })}
                      className="w-full rounded-xl border border-[#CBD5E1] p-2.5 font-bold focus:border-[#C25E34] focus:outline-none bg-[#F8FAFC]"
                    >
                      <option value="HOTEL">Hotels &amp; Stays Only</option>
                      <option value="CAB">Chauffeur Cabs Only</option>
                      <option value="ALL">All Categories</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#877B76] mb-1">Min Booking Value (₹)</label>
                    <input
                      type="number"
                      required
                      value={newCoupon.minBookingAmount}
                      onChange={(e) => setNewCoupon({ ...newCoupon, minBookingAmount: Number(e.target.value) })}
                      className="w-full rounded-xl border border-[#CBD5E1] p-2.5 font-bold focus:border-[#C25E34] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E2E8F0]">
                  <button
                    type="button"
                    onClick={() => setIsCreateCouponOpen(false)}
                    className="px-4 py-2 rounded-full border border-gray-300 font-bold text-gray-700 hover:bg-gray-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-search-gradient px-6 py-2 rounded-full font-bold uppercase tracking-wider text-white shadow-md cursor-pointer"
                  >
                    Launch Campaign
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
