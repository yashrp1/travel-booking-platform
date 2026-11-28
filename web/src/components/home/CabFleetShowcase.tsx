'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Users, Briefcase, Wind, CheckCircle2, Sparkles, Car, PlusCircle } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { useTheme } from '@/context/ThemeContext';

export default function CabFleetShowcase() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [cabs, setCabs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchFleet() {
      try {
        const res = await apiClient.getCabQuote({
          pickupLocation: 'Delhi',
          dropLocation: 'Agra',
          tripType: 'ONE_WAY',
          departureDate: '2026-12-01',
        });
        if (isMounted && res && res.options) {
          setCabs(res.options);
        }
      } catch (err) {
        console.error('Failed to fetch cab fleet:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    fetchFleet();
    return () => {
      isMounted = false;
    };
  }, []);

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
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`h-72 rounded-2xl animate-pulse ${
                isDark ? 'bg-white/5 border border-white/10' : 'bg-stone-100 border border-stone-200'
              }`}
            />
          ))}
        </div>
      ) : cabs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cabs.map((cab) => (
            <div
              key={cab.id}
              className={`group flex flex-col justify-between overflow-hidden rounded-2xl transition-all duration-300 ${
                isDark
                  ? 'bg-[#181126] border border-white/10 text-white shadow-lg hover:border-purple-500/40 hover:shadow-purple-950/20'
                  : 'bg-white border border-stone-200/80 text-stone-900 shadow-xs hover:border-[#C25E34]/30 hover:shadow-md'
              }`}
            >
              <div className="relative h-44 w-full overflow-hidden bg-stone-900">
                <img
                  src={cab.imageUrl}
                  alt={cab.name}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  <span className="rounded-md bg-stone-900/85 backdrop-blur-xs px-2.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                    {cab.category}
                  </span>
                </div>
              </div>

              <div className="flex flex-1 flex-col justify-between p-4.5">
                <div>
                  <h3 className="text-base font-bold text-stone-900 dark:text-white line-clamp-1 group-hover:text-[#C25E34] transition-colors">
                    {cab.name}
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5 line-clamp-1">
                    {cab.modelExamples}
                  </p>

                  <div className="flex items-center gap-4 mt-3 text-xs text-stone-500 dark:text-stone-400">
                    <div className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5 text-stone-400" />
                      <span>{cab.seatCapacity} Seats</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Briefcase className="h-3.5 w-3.5 text-stone-400" />
                      <span>{cab.luggageCapacity} Bags</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Wind className="h-3.5 w-3.5 text-stone-400" />
                      <span>AC</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-200/60 dark:border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-stone-500 uppercase tracking-wide block">Rate</span>
                    <span className="text-base font-bold text-stone-900 dark:text-white">
                      ₹{cab.baseFarePerKm}
                    </span>
                    <span className="text-[10px] text-stone-400"> / km</span>
                  </div>

                  <Link
                    href={`/cabs/listing?from=Delhi&to=Agra&type=${cab.category}`}
                    className="rounded-lg bg-[#C25E34] hover:bg-[#A84F2A] px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs transition-colors"
                  >
                    Select Cab
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div
          className={`flex flex-col items-center justify-center p-10 rounded-2xl border text-center ${
            isDark ? 'bg-white/5 border-white/10 text-stone-300' : 'bg-stone-50 border-stone-200 text-stone-600'
          }`}
        >
          <Car className="h-12 w-12 text-[#C25E34] mb-3" />
          <h3 className="text-lg font-bold text-stone-900 dark:text-white">No fleet registered yet</h3>
          <p className="text-sm max-w-md mt-1 mb-5 text-stone-500 dark:text-stone-400">
            All mock cabs have been removed. Cab operators can register an account and add their commercial vehicles to the database.
          </p>
          <Link
            href="/partner"
            className="inline-flex items-center gap-2 rounded-xl bg-[#C25E34] hover:bg-[#A84F2A] px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Register Fleet (Operator Portal)</span>
          </Link>
        </div>
      )}
    </section>
  );
}
