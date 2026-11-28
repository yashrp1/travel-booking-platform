'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Tag, Copy, Check, Sparkles, ShieldCheck, PlusCircle } from 'lucide-react';
import { apiClient } from '@/lib/api-client';

export default function OffersPage() {
  const [filter, setFilter] = useState<'ALL' | 'HOTEL' | 'CAB'>('ALL');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [offers, setOffers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchOffers() {
      try {
        const res = await apiClient.getActiveCoupons();
        if (isMounted && Array.isArray(res)) {
          setOffers(res);
        }
      } catch (err) {
        console.error('Failed to load active coupons:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    fetchOffers();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredOffers = offers.filter(
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
            Exclusive Deals &amp; Platform Coupons
          </h1>
          <p className="text-xs sm:text-sm text-[#877B76]">
            Apply active discount codes during hotel or cab checkout for instant fare deductions.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {[
            { id: 'ALL', label: `All Deals (${offers.length})` },
            { id: 'HOTEL', label: 'Hotels & Resorts' },
            { id: 'CAB', label: 'Cabs & Taxis' },
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
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-44 rounded-2xl bg-white border border-slate-200 animate-pulse" />
            ))}
          </div>
        ) : filteredOffers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOffers.map((offer) => (
              <div
                key={offer.id || offer.code}
                className="rounded-2xl bg-white border border-[#E2E8F0] p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="rounded bg-[#FFF4ED] px-2.5 py-0.5 text-xs font-bold text-[#C25E34] border border-[#FED7AA]">
                      {offer.category || 'PROMO'}
                    </span>
                    <span className="text-[11px] text-[#877B76]">
                      {offer.validTill ? `Valid till ${new Date(offer.validTill).toLocaleDateString()}` : 'Limited Time'}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#0F172A]">
                    {offer.description || offer.title || `Save with ${offer.code}`}
                  </h3>
                </div>

                <div className="mt-6 pt-4 border-t border-dashed border-[#E2E8F0] flex items-center justify-between">
                  <span className="font-mono text-sm font-black tracking-wider text-slate-800 bg-slate-100 px-3 py-1 rounded-lg">
                    {offer.code}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleCopy(offer.code)}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                      copiedCode === offer.code
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#C25E34] hover:bg-[#A84F2A] text-white shadow-xs'
                    }`}
                  >
                    {copiedCode === offer.code ? (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        <span>Copied</span>
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
        ) : (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
            <Tag className="h-10 w-10 text-[#C25E34] mx-auto mb-2" />
            <h3 className="text-base font-bold text-slate-900">No active promotions in database</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto mb-4">
              All mock coupons have been removed. Platform administrators can create discount promo codes in the Super Admin Console.
            </p>
            <Link
              href="/admin/dashboard"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#C25E34] text-white text-xs font-bold hover:bg-[#A84F2A]"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Create Coupon in Admin Console</span>
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
