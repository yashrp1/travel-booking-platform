'use client';

import React from 'react';
import Link from 'next/link';
import { Star, MapPin, Check, Sparkles } from 'lucide-react';
import { FEATURED_HOTELS } from '@/data/mock-data';
import { useTheme } from '@/context/ThemeContext';

export default function FeaturedHotels() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <div
            className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider ${
              isDark ? 'text-purple-400' : 'text-[#C25E34]'
            }`}
          >
            <Sparkles className="h-4 w-4" />
            <span>Handpicked Stays &amp; Popular Getaways</span>
          </div>
          <h2
            className={`text-2xl sm:text-3xl font-bold tracking-tight mt-1 font-sans ${
              isDark ? 'text-white' : 'text-[#18181B]'
            }`}
          >
            Featured Hotels, Resorts &amp; Homestays
          </h2>
          <p
            className={`text-sm font-normal mt-0.5 ${
              isDark ? 'text-stone-400' : 'text-stone-600'
            }`}
          >
            Verified traveler ratings, guaranteed best tariff rates &amp; instant confirmation
          </p>
        </div>

        <Link
          href="/hotels/listing"
          className={`text-xs sm:text-sm font-bold transition-colors inline-flex items-center gap-1 group ${
            isDark
              ? 'text-purple-400 hover:text-purple-300'
              : 'text-[#C25E34] hover:text-[#A84F2A]'
          }`}
        >
          <span>View All Hotels</span>
          <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
        </Link>
      </div>

      {/* Grid of Hotel Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {FEATURED_HOTELS.map((hotel) => (
          <div
            key={hotel.id}
            className={`group flex flex-col justify-between overflow-hidden rounded-2xl transition-all duration-300 ${
              isDark
                ? 'bg-[#181126] border border-white/10 text-white shadow-lg hover:border-purple-500/40 hover:shadow-purple-950/20'
                : 'bg-white border border-stone-200/80 text-stone-900 shadow-xs hover:border-[#C25E34]/30 hover:shadow-md'
            }`}
          >
            {/* Image Container */}
            <div className="relative h-52 w-full overflow-hidden bg-stone-900">
              <img
                src={hotel.imageUrl}
                alt={hotel.name}
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                <span className="rounded-md bg-stone-900/85 backdrop-blur-xs px-2.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                  {hotel.city}
                </span>
                {hotel.tags[0] && (
                  <span className="rounded-md bg-[#C25E34] px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
                    {hotel.tags[0]}
                  </span>
                )}
              </div>

              {/* MMT Style Rating Badge */}
              <div
                className={`absolute bottom-3 left-3 flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold shadow-sm border backdrop-blur-xs ${
                  isDark
                    ? 'bg-[#181126]/90 border-white/20 text-white'
                    : 'bg-white/95 border-stone-200 text-stone-900'
                }`}
              >
                <span className="rounded bg-amber-500 px-1.5 py-0.5 text-[10px] font-black text-white">
                  ★ {hotel.userRating}
                </span>
                <span className={`text-[11px] font-semibold ${isDark ? 'text-stone-300' : 'text-stone-600'}`}>
                  ({hotel.reviewCount} reviews)
                </span>
              </div>
            </div>

            {/* Hotel Information */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h3
                  className={`text-base font-bold transition-colors line-clamp-1 ${
                    isDark
                      ? 'text-white group-hover:text-purple-300'
                      : 'text-[#18181B] group-hover:text-[#C25E34]'
                  }`}
                >
                  {hotel.name}
                </h3>
                <p className={`flex items-center gap-1 text-xs mt-1 ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                  <MapPin className="h-3.5 w-3.5 text-stone-400 shrink-0" />
                  <span className="truncate">{hotel.distanceFromBeachOrCenter}</span>
                </p>

                {/* Key Inclusions */}
                <div className="mt-3 flex flex-wrap gap-1.5 text-[11px]">
                  {hotel.breakfastIncluded && (
                    <span
                      className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-semibold border ${
                        isDark
                          ? 'bg-purple-950/60 text-purple-300 border-purple-800/40'
                          : 'bg-orange-50 text-[#C25E34] border-orange-200'
                      }`}
                    >
                      <Check className="h-3 w-3" /> Breakfast Included
                    </span>
                  )}
                  {hotel.freeCancellation && (
                    <span
                      className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-semibold border ${
                        isDark
                          ? 'bg-white/5 text-stone-300 border-white/10'
                          : 'bg-stone-100 text-stone-700 border-stone-200'
                      }`}
                    >
                      <Check className="h-3 w-3" /> Free Cancellation
                    </span>
                  )}
                </div>
              </div>

              {/* Price & Action */}
              <div
                className={`pt-3 border-t flex items-end justify-between ${
                  isDark ? 'border-white/10' : 'border-stone-100'
                }`}
              >
                <div>
                  <span className="block text-xs text-stone-400 line-through">
                    ₹{hotel.originalPrice.toLocaleString('en-IN')}
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span
                      className={`text-xl font-bold font-sans ${
                        isDark ? 'text-white' : 'text-stone-900'
                      }`}
                    >
                      ₹{hotel.pricePerNight.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[11px] text-stone-400">
                      / night
                    </span>
                  </div>
                  <span className="text-[10px] text-stone-400 block font-medium">
                    + ₹{hotel.taxesAndFees} taxes &amp; fees
                  </span>
                </div>

                <Link
                  href={`/hotels/detail/${hotel.id}`}
                  className={`rounded-xl px-4 py-2 text-xs font-bold text-white shadow-sm transition-all cursor-pointer hover:shadow-md ${
                    isDark
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95'
                      : 'bg-[#C25E34] hover:bg-[#A84F2A]'
                  }`}
                >
                  View Deals
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
