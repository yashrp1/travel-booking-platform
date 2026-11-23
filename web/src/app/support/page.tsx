'use client';

import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import {
  Headphones,
  Phone,
  Mail,
  MessageSquare,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Send,
  CheckCircle2,
  Clock,
  ShieldCheck,
} from 'lucide-react';

export default function SupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [ticketSubject, setTicketSubject] = useState('');
  const [bookingRef, setBookingRef] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketCreated, setTicketCreated] = useState<string | null>(null);

  const faqs = [
    {
      q: 'How do I cancel my hotel reservation and get a refund?',
      a: 'Navigate to "My Trips" from the top navigation bar, select your hotel booking, and click "Cancel Booking". If cancelled at least 48 hours before check-in, a 100% refund will be automatically initiated to your original Razorpay payment method within 3-5 business days.',
    },
    {
      q: 'What if my cab driver is delayed or cannot reach my pickup location?',
      a: 'Driver details and contact numbers are SMSed 2 hours prior to scheduled departure. In case of delay exceeding 15 minutes, our 24x7 dispatch operations team will automatically reassign a priority replacement vehicle or issue a full instant credit.',
    },
    {
      q: 'How do I obtain a GST Tax Invoice for business travel claims?',
      a: 'All confirmed vouchers downloaded from the "My Trips" dashboard include a government-compliant GST tax breakdown with GSTIN and SAC service classification codes.',
    },
    {
      q: 'Are pets allowed in booked hotels?',
      a: 'Pet policies vary by property. Check the "Rules & Policies" section on the hotel details page, or contact our support team prior to booking to confirm pet-friendly room availability.',
    },
  ];

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `TKT-${Math.floor(100000 + Math.random() * 900000)}`;
    setTicketCreated(id);
    setTicketSubject('');
    setBookingRef('');
    setTicketMessage('');
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#F4F6F8]">
      <Header activeTab="hotels" onTabChange={() => {}} />

      <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full space-y-10">
        {/* Hero Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-[#0F172A] via-[#2F2927] to-[#0066FF] p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-[#3D3532]">
          <div>
            <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#F4F6F8]">
              24x7 Priority Assistance
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold font-black mt-2">How Can We Help You?</h1>
            <p className="text-xs sm:text-sm text-[#F4F6F8]/80 mt-1 max-w-lg">
              Round-the-clock support for booking re-scheduling, urgent cancellations, cab dispatch tracking, and payment verification.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="rounded-2xl bg-white/10 p-4 border border-white/20 backdrop-blur-md text-center">
              <Phone className="mx-auto h-6 w-6 text-[#94A3B8] mb-1" />
              <span className="text-[10px] text-[#F4F6F8]/80 block">Toll-Free Helpline</span>
              <strong className="text-sm font-black">1800-102-8747</strong>
            </div>

            <div className="rounded-2xl bg-white/10 p-4 border border-white/20 backdrop-blur-md text-center">
              <Mail className="mx-auto h-6 w-6 text-[#94A3B8] mb-1" />
              <span className="text-[10px] text-[#F4F6F8]/80 block">Email Support</span>
              <strong className="text-sm font-black">help@wanderstay.com</strong>
            </div>
          </div>
        </div>

        {/* FAQs and Ticket Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* FAQs (col-span-7) */}
          <div className="lg:col-span-7 space-y-4">
            <h2 className="text-xl font-bold font-black text-[#0F172A] flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-[#C25E34]" />
              <span>Frequently Asked Questions</span>
            </h2>

            <div className="space-y-3">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-2xl bg-white border border-[#E2E8F0] shadow-xs overflow-hidden transition-all"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between p-4 text-left font-bold text-xs sm:text-sm text-[#0F172A] hover:text-[#C25E34] transition-colors cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      {isOpen ? (
                        <ChevronUp className="h-4 w-4 shrink-0 text-[#877B76]" />
                      ) : (
                        <ChevronDown className="h-4 w-4 shrink-0 text-[#877B76]" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="p-4 pt-0 text-xs text-[#574E4A] leading-relaxed border-t border-[#E2E8F0]">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Ticket Submission Form (col-span-5) */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl bg-white border border-[#E2E8F0] p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-[#C25E34]" />
                <h3 className="text-lg font-bold font-black text-[#0F172A]">
                  Open a Support Ticket
                </h3>
              </div>

              {ticketCreated ? (
                <div className="rounded-xl bg-[#EFF6FF] border border-[#94A3B8] p-4 text-center space-y-2">
                  <CheckCircle2 className="mx-auto h-8 w-8 text-[#4D6B53]" />
                  <h4 className="text-sm font-bold text-[#0F172A]">
                    Ticket Raised Successfully!
                  </h4>
                  <p className="text-xs text-[#4D6B53]">
                    Reference ID: <strong className="font-mono">{ticketCreated}</strong>
                  </p>
                  <p className="text-[11px] text-[#877B76]">
                    An agent will respond to your registered email address within 30 minutes.
                  </p>
                  <button
                    onClick={() => setTicketCreated(null)}
                    className="mt-2 text-xs font-bold text-[#C25E34] hover:underline cursor-pointer"
                  >
                    Create Another Request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitTicket} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold text-[#877B76] mb-1">
                      Booking Reference ID (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. MMT-HTL-202611-9872"
                      value={bookingRef}
                      onChange={(e) => setBookingRef(e.target.value)}
                      className="w-full rounded-lg border border-[#CBD5E1] p-2 font-mono focus:border-[#C25E34] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#877B76] mb-1">
                      Issue Subject
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Payment deduction or cab delay inquiry"
                      value={ticketSubject}
                      onChange={(e) => setTicketSubject(e.target.value)}
                      className="w-full rounded-lg border border-[#CBD5E1] p-2 focus:border-[#C25E34] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#877B76] mb-1">
                      Detailed Description
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Please describe your query with relevant details..."
                      value={ticketMessage}
                      onChange={(e) => setTicketMessage(e.target.value)}
                      className="w-full rounded-lg border border-[#CBD5E1] p-2 focus:border-[#C25E34] focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full btn-search-gradient rounded-full py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>Submit Query</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
