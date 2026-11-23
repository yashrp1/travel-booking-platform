'use client';

import React from 'react';
import Link from 'next/link';
import { Users, Briefcase, Wind, CheckCircle2, Sparkles } from 'lucide-react';
import { CAB_FLEET } from '@/data/mock-data';
import { useTheme } from '@/context/ThemeContext';

export default function CabFleetShowcase() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <div
            className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider ${
              isDark ? 'text-purple-400' : 'text-[#C25E34]'
            }`}
          >
            <Sparkles className="h-4 w-4" />
            <span>Outstation Cabs &amp; Airport Transfers</span>
          </div>
          <h2
            className={`text-2xl sm:text-3xl font-bold tracking-tight mt-1 font-sans ${
              isDark ? 'text-white' : 'text-[#18181B]'
            }`}
          >
            Reliable Fleet for Highway &amp; City Travel
          </h2>
          <p
            className={`text-sm font-normal mt-0.5 ${
              isDark ? 'text-stone-400' : 'text-stone-600'
            }`}
          >
            Guaranteed AC, highway-certified chauffeurs, transparent km rates &amp; zero hidden tolls
          </p>
        </div>

        <Link
          href="/cabs/listing"
          className={`text-xs sm:text-sm font-bold transition-colors inline-flex items-center gap-1 group ${
            isDark
              ? 'text-purple-400 hover:text-purple-300'
              : 'text-[#C25E34] hover:text-[#A84F2A]'
          }`}
        >
          <span>View All Cabs</span>
          <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
        </Link>
      </div>

      {/* Cab Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {CAB_FLEET.map((cab) => (
          <div
            key={cab.id}
            className={`group flex flex-col justify-between overflow-hidden rounded-2xl transition-all duration-300 ${
              isDark
                ? 'bg-[#181126] border border-white/10 text-white shadow-lg hover:border-purple-500/40 hover:shadow-purple-950/20'
                : 'bg-white border border-stone-200/80 text-stone-900 shadow-xs hover:border-[#C25E34]/30 hover:shadow-md'
            }`}
          >
            {/* Image */}
            <div
              className={`relative h-48 w-full overflow-hidden p-4 flex items-center justify-center border-b ${
                isDark ? 'bg-stone-900/60 border-white/10' : 'bg-stone-50 border-stone-100'
              }`}
            >
              <img
                src={cab.imageUrl}
                alt={cab.name}
                className="h-full w-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-3 left-3 rounded-md bg-stone-900 px-2.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                {cab.category}
              </span>
            </div>

            {/* Content */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h3
                  className={`text-base font-bold transition-colors ${
                    isDark
                      ? 'text-white group-hover:text-purple-300'
                      : 'text-[#18181B] group-hover:text-[#C25E34]'
                  }`}
                >
                  {cab.name}
                </h3>
                <p className={`text-xs mt-0.5 ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                  {cab.modelExamples}
                </p>

                {/* Capacity Badges */}
                <div
                  className={`mt-3 flex items-center gap-3 text-xs font-semibold p-2.5 rounded-xl border ${
                    isDark
                      ? 'bg-white/5 border-white/10 text-stone-200'
                      : 'bg-stone-50 border-stone-200 text-stone-700'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-stone-400" />
                    <span>{cab.seatCapacity} Seats</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Briefcase className="h-3.5 w-3.5 text-stone-400" />
                    <span>{cab.luggageCapacity} Bags</span>
                  </div>
                  <div
                    className={`flex items-center gap-1.5 font-bold ${
                      isDark ? 'text-purple-300' : 'text-[#C25E34]'
                    }`}
                  >
                    <Wind className="h-3.5 w-3.5" />
                    <span>AC</span>
                  </div>
                </div>

                {/* Features */}
                <ul className="mt-3 space-y-1.5 text-xs">
                  {cab.features.slice(0, 2).map((feat, i) => (
                    <li
                      key={i}
                      className={`flex items-center gap-1.5 ${
                        isDark ? 'text-stone-300' : 'text-stone-600'
                      }`}
                    >
                      <CheckCircle2
                        className={`h-3.5 w-3.5 shrink-0 ${
                          isDark ? 'text-purple-400' : 'text-[#C25E34]'
                        }`}
                      />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price & Action */}
              <div
                className={`pt-3 border-t flex items-center justify-between ${
                  isDark ? 'border-white/10' : 'border-stone-100'
                }`}
              >
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">
                    Starting from
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span
                      className={`text-lg font-bold font-sans ${
                        isDark ? 'text-white' : 'text-stone-900'
                      }`}
                    >
                      ₹{cab.baseFareOneWayPerKm}
                    </span>
                    <span className="text-xs text-stone-400">/ km</span>
                  </div>
                </div>

                <Link
                  href={`/cabs/listing?category=${cab.category}`}
                  className={`rounded-xl px-4 py-2 text-xs font-bold text-white shadow-xs transition-all cursor-pointer hover:shadow-md ${
                    isDark
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95'
                      : 'bg-[#C25E34] hover:bg-[#A84F2A]'
                  }`}
                >
                  Select Cab
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
