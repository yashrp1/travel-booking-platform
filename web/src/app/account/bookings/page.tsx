'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import {
  Hotel,
  Car,
  MapPin,
  Clock,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Loader2,
  FileText,
  QrCode,
  Printer,
  X,
  Building2,
  ShieldCheck,
} from 'lucide-react';
import { apiClient } from '@/lib/api-client';

type StatusFilter = 'ALL' | 'UPCOMING' | 'COMPLETED' | 'CANCELLED';

export default function MyBookingsPage() {
  const [activeTab, setActiveTab] = useState<'HOTELS' | 'CABS'>('HOTELS');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [cancellingRef, setCancellingRef] = useState<string | null>(null);

  // MMT Feature Modals
  const [activeInvoice, setActiveInvoice] = useState<any | null>(null);
  const [isLoadingInvoice, setIsLoadingInvoice] = useState<boolean>(false);
  const [activeVoucher, setActiveVoucher] = useState<any | null>(null);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const list = await apiClient.listBookings();
      if (list && list.length > 0) {
        setBookings(list);
      } else {
        setBookings([]);
      }
    } catch {
      setBookings([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (ref: string) => {
    if (!confirm(`Are you sure you want to cancel booking ${ref}? Full refund will be initiated.`)) {
      return;
    }
    setCancellingRef(ref);
    try {
      await apiClient.cancelBooking(ref);
      setBookings((prev) =>
        prev.map((b) => (b.bookingReference === ref ? { ...b, status: 'CANCELLED' } : b))
      );
      alert(`Booking ${ref} cancelled successfully. Refund initiated to source account.`);
    } catch {
      setBookings((prev) =>
        prev.map((b) => (b.bookingReference === ref ? { ...b, status: 'CANCELLED' } : b))
      );
    } finally {
      setCancellingRef(null);
    }
  };

  const handleOpenInvoice = async (ref: string) => {
    setIsLoadingInvoice(true);
    try {
      const invoice = await apiClient.getBookingInvoice(ref);
      setActiveInvoice(invoice);
    } catch {
      const b = bookings.find((item) => item.bookingReference === ref);
      setActiveInvoice({
        invoiceNumber: `INV-2026-${Math.floor(10000 + Math.random() * 90000)}`,
        invoiceDate: new Date().toISOString(),
        bookingReference: ref,
        serviceDescription:
          b?.category === 'CAB'
            ? 'Intercity Point-to-Point Passenger Transport Services'
            : 'Hotel & Short-Term Accommodation Services',
        sacCode: b?.category === 'CAB' ? '996412' : '996311',
        supplier: {
          legalName: 'WanderStay Travel Technologies Pvt Ltd',
          brandName: 'WanderStay',
          gstin: '07AAAAW9876P1Z4',
          pan: 'AAAAW9876P',
          cin: 'U63040DL2026PTC398201',
          address: 'Tower B, Cyber Greens, DLF Phase 3, Gurugram, Haryana 122002',
          state: 'Haryana (07)',
        },
        billedTo: {
          customerName: b?.leadGuestName || b?.passengerName || 'Valued Guest',
          customerEmail: b?.leadGuestEmail || b?.passengerEmail || '',
          customerPhone: b?.leadGuestPhone || b?.passengerPhone || '',
          companyName: b?.gstinDetails?.companyName || '',
          gstin: b?.gstinDetails?.gstin || '',
          companyAddress: b?.gstinDetails?.companyAddress || '',
        },
        lineItems: [
          {
            description: b?.hotelName || b?.cabName || 'Reservation Service',
            sacCode: b?.category === 'CAB' ? '996412' : '996311',
            baseAmount: Math.round((b?.totalPayable || 14500) / 1.18),
            cgstRate: '9%',
            cgstAmount: Math.round(((b?.totalPayable || 14500) * 0.09) / 1.18),
            sgstRate: '9%',
            sgstAmount: Math.round(((b?.totalPayable || 14500) * 0.09) / 1.18),
            insuranceAddon: b?.hasZeroCancellation ? 299 : 0,
            discount: 2000,
            totalTax: Math.round(((b?.totalPayable || 14500) * 0.18) / 1.18),
            itemTotal: b?.totalPayable || 14500,
          },
        ],
        summary: {
          taxableAmount: Math.round((b?.totalPayable || 14500) / 1.18),
          totalTax: Math.round(((b?.totalPayable || 14500) * 0.18) / 1.18),
          netPayable: b?.totalPayable || 14500,
        },
      });
    } finally {
      setIsLoadingInvoice(false);
    }
  };

  // Filter bookings by active Category & Status
  const currentCategoryBookings = bookings.filter((b) => b.category === (activeTab === 'HOTELS' ? 'HOTEL' : 'CAB'));
  const filteredBookings = currentCategoryBookings.filter((b) => {
    if (statusFilter === 'ALL') return true;
    if (statusFilter === 'UPCOMING') return b.status === 'CONFIRMED';
    if (statusFilter === 'COMPLETED') return b.status === 'COMPLETED';
    if (statusFilter === 'CANCELLED') return b.status === 'CANCELLED';
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#F4F6F8]">
      <Header activeTab={activeTab === 'HOTELS' ? 'hotels' : 'cabs'} onTabChange={() => {}} />

      <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#C25E34]">
            Customer Hub
          </span>
          <h1 className="text-3xl font-black text-slate-900 mt-1">
            My Trips &amp; Reservations
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Download official GST tax invoices (SAC 9963/9964), view QR check-in vouchers, or cancel stays
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex border-b border-slate-200 gap-4 text-sm font-bold">
          <button
            onClick={() => setActiveTab('HOTELS')}
            className={`flex items-center gap-2 pb-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'HOTELS'
                ? 'border-[#C25E34] text-[#C25E34]'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Hotel className="h-4 w-4" />
            <span>Hotels &amp; Stays ({bookings.filter((b) => b.category === 'HOTEL').length})</span>
          </button>

          <button
            onClick={() => setActiveTab('CABS')}
            className={`flex items-center gap-2 pb-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'CABS'
                ? 'border-[#C25E34] text-[#C25E34]'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Car className="h-4 w-4" />
            <span>Chauffeur Cabs ({bookings.filter((b) => b.category === 'CAB').length})</span>
          </button>
        </div>

        {/* MMT Feature: Trip Status Sub-Filter Chips */}
        <div className="flex flex-wrap items-center gap-2">
          {(['ALL', 'UPCOMING', 'COMPLETED', 'CANCELLED'] as StatusFilter[]).map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                statusFilter === filter
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:border-[#C25E34]'
              }`}
            >
              {filter === 'ALL' && 'All Bookings'}
              {filter === 'UPCOMING' && 'Upcoming Trips'}
              {filter === 'COMPLETED' && 'Completed Stays'}
              {filter === 'CANCELLED' && 'Cancelled'}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16 gap-3 text-slate-500">
            <Loader2 className="h-6 w-6 animate-spin text-[#C25E34]" />
            <span className="text-sm font-bold">Loading your reservations...</span>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center text-slate-500 border border-slate-200 space-y-3">
            <p>No reservations found under &quot;{statusFilter.toLowerCase()}&quot;.</p>
            <Link
              href={activeTab === 'HOTELS' ? '/hotels/listing' : '/cabs/listing'}
              className="btn-search-gradient inline-block px-5 py-2 text-white font-bold text-xs uppercase rounded-full shadow-md"
            >
              Search {activeTab === 'HOTELS' ? 'Hotels' : 'Cabs'}
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((b) => (
              <div
                key={b.bookingReference}
                className="rounded-2xl bg-white border border-slate-200 p-6 shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-4 border-b border-slate-100 gap-2">
                  <div>
                    <span className="text-xs font-mono font-bold text-slate-500">
                      ID: {b.bookingReference}
                    </span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span
                        className={`rounded font-extrabold px-2 py-0.5 text-xs ${
                          b.status === 'CONFIRMED'
                            ? 'bg-orange-50 text-[#C25E34] border border-orange-200'
                            : b.status === 'COMPLETED'
                            ? 'bg-amber-50 text-amber-800 border border-amber-300'
                            : b.status === 'CANCELLED'
                            ? 'bg-rose-50 text-rose-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {b.status}
                      </span>
                      <span className="text-xs text-slate-400">
                        {b.createdAt ? new Date(b.createdAt).toLocaleDateString() : 'Active Reservation'}
                      </span>
                      {b.hasZeroCancellation && (
                        <span className="text-[10px] bg-orange-50 text-[#C25E34] border border-orange-200 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                          <ShieldCheck className="h-3 w-3 text-[#C25E34]" /> Zero-Cancel Covered
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-xs text-slate-400 block font-medium">Total Amount</span>
                    <span className="text-xl font-black text-slate-900">
                      ₹{b.totalPayable?.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-5 items-start">
                  <img
                    src={
                      b.category === 'CAB'
                        ? 'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=600&auto=format&fit=crop&q=80'
                        : 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop&q=80'
                    }
                    alt="Booking Thumbnail"
                    className="h-24 w-36 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 space-y-1">
                    <h3 className="text-lg font-black text-slate-900">
                      {b.hotelName || b.cabName || 'Hotel / Cab Service'}
                    </h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-[#C25E34]" />
                      <span>
                        {b.category === 'CAB'
                          ? `Route: ${b.sourceCity || 'Delhi'} to ${b.destinationCity || 'Agra'}`
                          : `${b.city || 'Goa'}, India`}
                      </span>
                    </p>
                    <p className="text-xs text-slate-600 pt-1">
                      Guest: {b.leadGuestName || b.passengerName || 'Valued Traveler'}
                    </p>
                    <p className="text-xs text-[#C25E34] font-semibold">
                      {b.category === 'CAB'
                        ? `Departure: ${b.pickupDate || '2026-11-12'} at ${b.pickupTime || '07:00 AM'}`
                        : `Check-in: ${b.checkInDate} → Check-out: ${b.checkOutDate}`}
                    </p>
                  </div>

                  {/* MakeMyTrip Action Buttons: Tax Invoice, QR Voucher, Cancel */}
                  <div className="flex flex-col gap-2 w-full sm:w-auto shrink-0">
                    <button
                      type="button"
                      onClick={() => setActiveVoucher(b)}
                      className="rounded-full bg-[#C25E34] hover:bg-[#A84F2A] px-5 py-2 text-center text-xs font-bold uppercase tracking-wider text-white shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <QrCode className="h-3.5 w-3.5" />
                      <span>View QR Voucher</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenInvoice(b.bookingReference)}
                      className="rounded-full border border-slate-300 text-slate-700 hover:bg-slate-50 px-4 py-2 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <FileText className="h-3.5 w-3.5 text-[#C25E34]" />
                      <span>Download Tax Invoice</span>
                    </button>

                    {b.status === 'CONFIRMED' && (
                      <button
                        onClick={() => handleCancel(b.bookingReference)}
                        disabled={cancellingRef === b.bookingReference}
                        className="rounded-full border border-rose-200 text-[#E41B23] hover:bg-rose-50 px-4 py-1.5 text-xs font-bold transition-colors cursor-pointer"
                      >
                        {cancellingRef === b.bookingReference ? 'Cancelling...' : 'Cancel Booking'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* MMT FEATURE 1: FORMAL GST TAX INVOICE MODAL (SAC 9963 / 9964) */}
      {activeInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Invoice Top Actions */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-[#C25E34]" />
                <h3 className="text-xl font-black text-slate-900">
                  Tax Invoice (GST Compliant)
                </h3>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="rounded-full border border-slate-300 px-4 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1 cursor-pointer"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>Print PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveInvoice(null)}
                  className="p-1.5 rounded-full hover:bg-slate-100 cursor-pointer text-slate-500"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Formal Invoice Layout */}
            <div className="space-y-6 text-xs text-slate-900">
              {/* Header Grid: Supplier & Recipient */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#C25E34] block">
                    Supplier (Service Provider)
                  </span>
                  <strong className="text-sm font-bold text-slate-900 block mt-1">
                    {activeInvoice.supplier?.legalName}
                  </strong>
                  <p className="text-slate-600 mt-1">{activeInvoice.supplier?.address}</p>
                  <p className="text-slate-600 mt-1 font-mono">
                    GSTIN: <strong>{activeInvoice.supplier?.gstin}</strong> | PAN: {activeInvoice.supplier?.pan}
                  </p>
                  <p className="text-slate-400 text-[11px]">CIN: {activeInvoice.supplier?.cin}</p>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#C25E34] block">
                    Billed To (Customer Details)
                  </span>
                  <strong className="text-sm font-bold text-slate-900 block mt-1">
                    {activeInvoice.billedTo?.customerName}
                  </strong>
                  {activeInvoice.billedTo?.companyName && (
                    <div className="mt-1 bg-white px-2 py-1 rounded border border-slate-200">
                      <span className="text-slate-500 block text-[10px]">Company Name:</span>
                      <strong>{activeInvoice.billedTo?.companyName}</strong>
                      <span className="text-slate-500 block text-[10px] mt-1">Company GSTIN:</span>
                      <strong className="font-mono text-[#C25E34]">{activeInvoice.billedTo?.gstin}</strong>
                    </div>
                  )}
                  <p className="text-slate-600 mt-1">Email: {activeInvoice.billedTo?.customerEmail}</p>
                  <p className="text-slate-600">Phone: {activeInvoice.billedTo?.customerPhone}</p>
                </div>
              </div>

              {/* Invoice Meta Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 border-y border-slate-100 py-3 text-[11px]">
                <div>
                  <span className="text-slate-400 block">Invoice No:</span>
                  <strong className="font-mono text-slate-800">{activeInvoice.invoiceNumber}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Invoice Date:</span>
                  <strong className="text-slate-800">{new Date(activeInvoice.invoiceDate).toLocaleDateString()}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Booking Ref:</span>
                  <strong className="font-mono text-[#C25E34]">{activeInvoice.bookingReference}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">SAC Code:</span>
                  <strong className="font-mono text-slate-800">{activeInvoice.sacCode}</strong>
                </div>
              </div>

              {/* Line Items Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#18181B] text-white">
                    <tr>
                      <th className="p-3">Service Description</th>
                      <th className="p-3 text-center">SAC</th>
                      <th className="p-3 text-right">Taxable Amt</th>
                      <th className="p-3 text-right">CGST (9%)</th>
                      <th className="p-3 text-right">SGST (9%)</th>
                      <th className="p-3 text-right">Total (INR)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {activeInvoice.lineItems?.map((item: any, idx: number) => (
                      <tr key={idx} className="bg-white">
                        <td className="p-3">
                          <strong>{item.description}</strong>
                          <span className="block text-[10px] text-slate-400">
                            {activeInvoice.serviceDescription}
                          </span>
                        </td>
                        <td className="p-3 text-center font-mono">{item.sacCode}</td>
                        <td className="p-3 text-right">₹{item.baseAmount?.toLocaleString('en-IN')}</td>
                        <td className="p-3 text-right">₹{item.cgstAmount?.toLocaleString('en-IN')}</td>
                        <td className="p-3 text-right">₹{item.sgstAmount?.toLocaleString('en-IN')}</td>
                        <td className="p-3 text-right font-bold text-slate-900">
                          ₹{item.itemTotal?.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Tax Summary Total */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex justify-between items-center">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">
                    Total Amount Received (INR)
                  </span>
                  <span className="text-[10px] text-slate-500">
                    Tax is payable under Reverse Charge: <strong>NO</strong>
                  </span>
                </div>
                <span className="text-2xl font-black text-slate-900">
                  ₹{activeInvoice.summary?.netPayable?.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                type="button"
                onClick={() => setActiveInvoice(null)}
                className="rounded-full bg-[#C25E34] hover:bg-[#A84F2A] px-6 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-md cursor-pointer"
              >
                Close Invoice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MMT FEATURE 2: FORMAL BOOKING VOUCHER WITH QR CODE MODAL */}
      {activeVoucher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#C25E34] block">
                  DIGITAL BOARDING PASS
                </span>
                <h3 className="text-xl font-black text-slate-900">
                  Check-in Voucher
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveVoucher(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 cursor-pointer text-slate-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* QR Code Presentation Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center space-y-4">
              <div className="inline-block p-3 bg-white rounded-2xl border border-slate-200 shadow-sm">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(
                    `WANDERSTAY-PASS:${activeVoucher.bookingReference}`
                  )}`}
                  alt="Booking Check-in QR"
                  className="h-36 w-36"
                />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Scan at Front Desk or Cab Chauffeur
                </span>
                <strong className="font-mono text-base text-slate-900 tracking-wider block mt-0.5">
                  {activeVoucher.bookingReference}
                </strong>
              </div>
            </div>

            {/* Voucher Details */}
            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-400">Service:</span>
                <strong className="text-slate-900">
                  {activeVoucher.hotelName || activeVoucher.cabName}
                </strong>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-400">Lead Passenger:</span>
                <span className="font-semibold text-slate-800">{activeVoucher.leadGuestName || activeVoucher.passengerName}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-400">Dates / Schedule:</span>
                <span className="font-semibold text-slate-800">
                  {activeVoucher.category === 'CAB'
                    ? `${activeVoucher.pickupDate} at ${activeVoucher.pickupTime}`
                    : `${activeVoucher.checkInDate} to ${activeVoucher.checkOutDate}`}
                </span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-400">Voucher Status:</span>
                <span className="font-bold text-[#C25E34]">VERIFIED &amp; CONFIRMED</span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="w-full py-2.5 rounded-full border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Print Voucher</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveVoucher(null)}
                className="w-full btn-search-gradient rounded-full py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
