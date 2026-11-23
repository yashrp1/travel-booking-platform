'use client';

import React from 'react';
import { ShieldCheck, Clock, BadgePercent, Headphones, Sparkles } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export default function WhyChooseUs() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const perks = [
    {
      icon: ShieldCheck,
      title: 'Curated Heritage Audits',
      description: 'Strict hygiene protocols, verified photography & certified amenity listings for every property.',
    },
    {
      icon: Clock,
      title: 'Instant Confirmation',
      description: 'Direct inventory hold and authenticated PDF reservation vouchers dispatched immediately.',
    },
    {
      icon: BadgePercent,
      title: 'Transparent Pricing',
      description: 'Transparent itemized rate cards, verified GST invoices & zero surprise toll or service fees.',
    },
    {
      icon: Headphones,
      title: '24x7 Private Concierge',
      description: 'Dedicated travel consultants on call to assist with rescheduling, dietary requests, or chauffeur tracking.',
    },
  ];

  return (
    <section
      className={`border-y py-14 my-8 transition-colors duration-200 ${
        isDark
          ? 'bg-[#140D22] border-white/10 text-white'
          : 'bg-[#FDFBF7] border-stone-200/80 text-stone-900'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div
            className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-bold border ${
              isDark
                ? 'bg-purple-950/60 border-purple-800/40 text-purple-300'
                : 'bg-orange-50 border-orange-200 text-[#C25E34]'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>The WanderStay Privilege Standard</span>
          </div>
          <h2
            className={`text-2xl sm:text-3xl font-bold tracking-tight mt-2 font-sans ${
              isDark ? 'text-white' : 'text-[#18181B]'
            }`}
          >
            Where Style Meets Dependability
          </h2>
          <p
            className={`text-sm mt-1 leading-relaxed ${
              isDark ? 'text-stone-400' : 'text-stone-600'
            }`}
          >
            Engineered with uncompromising precision, transparent billing, and authentic hospitality across India.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {perks.map((perk, idx) => {
            const Icon = perk.icon;
            return (
              <div key={idx} className="flex flex-col items-center text-center p-4">
                <div
                  className={`h-12 w-12 rounded-2xl flex items-center justify-center mb-4 shadow-xs border ${
                    isDark
                      ? 'bg-purple-900/30 text-purple-300 border-purple-700/30'
                      : 'bg-orange-50 text-[#C25E34] border-orange-200/60'
                  }`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <h3
                  className={`text-base font-bold ${
                    isDark ? 'text-white' : 'text-[#18181B]'
                  }`}
                >
                  {perk.title}
                </h3>
                <p
                  className={`text-xs mt-2 leading-relaxed ${
                    isDark ? 'text-stone-400' : 'text-stone-600'
                  }`}
                >
                  {perk.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
