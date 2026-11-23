'use client';

import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Tag, Copy, Check, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';
import { SPECIAL_OFFERS, Offer } from '@/data/mock-data';

export default function OffersPage() {
  const [filter, setFilter] = useState<'ALL' | 'HOTEL' | 'CAB' | 'BANK'>('ALL');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const filteredOffers = SPECIAL_OFFERS.filter(
    (off) => filter === 'ALL' || off.category === filter
  );

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#F4F6F8]">
      <Header activeTab="hotels" onTabChange={() => {}} />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full space-y-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#C25E34]">
            Privilege &amp; Promotions
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold font-black text-[#0F172A] mt-1">
            Exclusive Deals &amp; Bank Offers
          </h1>
          <p className="text-xs sm:text-sm text-[#877B76]">
            Apply active discount codes during hotel or cab checkout for instant fare deductions.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {[
            { id: 'ALL', label: 'All Deals (4)' },
            { id: 'HOTEL', label: 'Hotels & Resorts (2)' },
            { id: 'CAB', label: 'Cabs & Taxis (1)' },
            { id: 'BANK', label: 'Bank & Card Deals (1)' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`rounded-full px-5 py-2 text-xs font-bold transition-all cursor-pointer ${
                filter === tab.id
                  ? 'bg-[#C25E34] text-white shadow-md'
                  : 'bg-white text-[#574E4A] border border-[#E2E8F0] hover:bg-[#EFF6FF]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOffers.map((offer) => (
            <div
              key={offer.id}
              className="rounded-3xl bg-white border border-[#E2E8F0] p-6 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="rounded-full bg-orange-50 border border-orange-200 px-3 py-1 text-xs font-bold text-[#C25E34] uppercase tracking-wider">
                    {offer.discountBadge}
                  </span>
                  <span className="text-xs text-[#877B76]">
                    Valid till {offer.validTill}
                  </span>
                </div>

                <h3 className="text-xl font-bold font-black text-[#0F172A]">
                  {offer.title}
                </h3>
                <p className="text-xs text-[#574E4A] mt-2 leading-relaxed">
                  {offer.description}
                </p>

                <div className="mt-4 text-[11px] text-[#877B76] bg-[#F8FAFC] border border-[#E2E8F0] p-2.5 rounded-xl">
                  <span>Minimum booking transaction value: </span>
                  <strong className="text-[#0F172A]">₹{offer.minBooking.toLocaleString('en-IN')}</strong>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-dashed border-[#E2E8F0] flex items-center justify-between">
                <div className="font-mono text-xs font-black tracking-wider text-[#0F172A] bg-[#EFF6FF] px-3 py-1.5 rounded-lg border border-[#CBD5E1]">
                  {offer.code}
                </div>

                <button
                  type="button"
                  onClick={() => handleCopy(offer.code)}
                  className="btn-search-gradient rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  {copiedCode === offer.code ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
