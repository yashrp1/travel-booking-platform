'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Tag, Copy, Check, Sparkles, PlusCircle } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { useTheme } from '@/context/ThemeContext';

export default function OffersSection() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [filter, setFilter] = useState<'ALL' | 'HOTEL' | 'CAB' | 'BANK'>('ALL');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [offers, setOffers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchCoupons() {
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
    fetchCoupons();
    return () => {
      isMounted = false;
    };
  }, []);

  if (!isLoading && offers.length === 0) {
    return null;
  }

  if (isLoading) {
    return null;
  }

  const filteredOffers = offers.filter(
    (off) => filter === 'ALL' || off.category === filter || (filter === 'BANK' && off.code.includes('BANK'))
  );

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div
            className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${
              isDark ? 'text-purple-400' : 'text-[#C25E34]'
            }`}
          >
            <Sparkles className="h-4 w-4" />
            <span>Exclusive Travel Deals &amp; Discounts</span>
          </div>
          <h2
            className={`text-2xl font-bold tracking-tight mt-1 font-sans ${
              isDark ? 'text-white' : 'text-[#18181B]'
            }`}
          >
            Offers &amp; Promo Codes
          </h2>
          <p
            className={`text-sm font-normal mt-0.5 ${
              isDark ? 'text-stone-400' : 'text-stone-600'
            }`}
          >
            Apply authenticated coupon codes at checkout for instant cashbacks and savings
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {[
            { id: 'ALL', label: 'All Offers' },
            { id: 'HOTEL', label: 'Hotels' },
            { id: 'CAB', label: 'Cabs' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all shrink-0 cursor-pointer ${
                filter === tab.id
                  ? 'bg-[#C25E34] text-white shadow-xs'
                  : isDark
                  ? 'bg-white/5 text-stone-300 hover:bg-white/10'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Offers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOffers.map((offer) => (
            <div
              key={offer.id || offer.code}
              className={`flex flex-col justify-between p-6 rounded-2xl border transition-all duration-300 ${
                isDark
                  ? 'bg-[#181126] border-white/10 text-white hover:border-purple-500/40'
                  : 'bg-white border-stone-200 text-stone-900 hover:border-[#C25E34]/30 hover:shadow-md'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="rounded-md bg-[#C25E34]/10 text-[#C25E34] px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider">
                    {offer.category || 'PROMO'}
                  </span>
                  <span className="text-[11px] text-stone-400">
                    {offer.validTill ? `Valid till ${new Date(offer.validTill).toLocaleDateString()}` : 'Limited Time'}
                  </span>
                </div>

                <h3 className="text-base font-bold text-stone-900 dark:text-white">
                  {offer.description || offer.title || `Save with ${offer.code}`}
                </h3>
              </div>

              <div className="mt-5 pt-3 border-t border-dashed border-stone-200 dark:border-white/10 flex items-center justify-between">
                <span className="font-mono text-sm font-black tracking-wider text-stone-800 dark:text-stone-200 bg-stone-100 dark:bg-white/10 px-3 py-1 rounded-lg">
                  {offer.code}
                </span>

                <button
                  type="button"
                  onClick={() => handleCopy(offer.code)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    copiedCode === offer.code
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#C25E34] hover:bg-[#A84F2A] text-white'
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
    </section>
  );
}
