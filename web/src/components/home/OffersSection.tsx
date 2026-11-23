'use client';

import React, { useState } from 'react';
import { Tag, Copy, Check, Sparkles } from 'lucide-react';
import { SPECIAL_OFFERS, Offer } from '@/data/mock-data';
import { useTheme } from '@/context/ThemeContext';

export default function OffersSection() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
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
            Offers &amp; Bank Coupons
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
            { id: 'BANK', label: 'Bank Discounts' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                filter === tab.id
                  ? isDark
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                    : 'bg-[#C25E34] text-white shadow-md'
                  : isDark
                  ? 'bg-white/5 text-stone-300 border border-white/10 hover:bg-white/10 hover:text-white'
                  : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50 hover:text-stone-900 shadow-2xs'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Offers Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredOffers.map((offer) => (
          <div
            key={offer.id}
            className={`group relative flex flex-col justify-between rounded-2xl p-5 transition-all duration-200 ${
              isDark
                ? 'bg-[#181126] border border-white/10 text-white shadow-lg hover:border-purple-500/40 hover:shadow-purple-950/20'
                : 'bg-white border border-stone-200/80 text-stone-900 shadow-xs hover:border-[#C25E34]/40 hover:shadow-md'
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide border ${
                    isDark
                      ? 'bg-purple-950/70 border-purple-800/60 text-purple-300'
                      : 'bg-orange-50 border-orange-200 text-[#C25E34]'
                  }`}
                >
                  {offer.discountBadge}
                </span>
                <span
                  className={`text-[10px] font-medium ${
                    isDark ? 'text-stone-400' : 'text-stone-400'
                  }`}
                >
                  Valid: {offer.validTill}
                </span>
              </div>

              <h3
                className={`text-sm font-bold transition-colors ${
                  isDark
                    ? 'text-white group-hover:text-purple-300'
                    : 'text-[#18181B] group-hover:text-[#C25E34]'
                }`}
              >
                {offer.title}
              </h3>
              <p
                className={`text-xs mt-1.5 leading-relaxed font-normal ${
                  isDark ? 'text-stone-300' : 'text-stone-600'
                }`}
              >
                {offer.description}
              </p>
            </div>

            <div
              className={`mt-5 pt-3 border-t border-dashed flex items-center justify-between ${
                isDark ? 'border-white/10' : 'border-stone-200'
              }`}
            >
              <div
                className={`flex items-center gap-1.5 font-mono text-xs font-bold tracking-wider px-2.5 py-1 rounded-lg border ${
                  isDark
                    ? 'bg-white/5 text-purple-200 border-white/10'
                    : 'bg-stone-50 text-stone-900 border-stone-200'
                }`}
              >
                <Tag
                  className={`h-3 w-3 ${
                    isDark ? 'text-purple-400' : 'text-[#C25E34]'
                  }`}
                />
                <span>{offer.code}</span>
              </div>

              <button
                type="button"
                onClick={() => handleCopy(offer.code)}
                className={`flex items-center gap-1 text-xs font-bold transition-colors cursor-pointer ${
                  isDark
                    ? 'text-purple-400 hover:text-purple-300'
                    : 'text-[#C25E34] hover:text-[#A84F2A]'
                }`}
              >
                {copiedCode === offer.code ? (
                  <>
                    <Check
                      className={`h-3.5 w-3.5 ${
                        isDark ? 'text-purple-400' : 'text-[#C25E34]'
                      }`}
                    />
                    <span className={isDark ? 'text-purple-400' : 'text-[#C25E34]'}>
                      Copied!
                    </span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy</span>
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
