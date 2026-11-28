'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Star, MapPin, Check, Sparkles, Building2, PlusCircle } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { useTheme } from '@/context/ThemeContext';

export default function FeaturedHotels() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [hotels, setHotels] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchHotels() {
      try {
        const res = await apiClient.searchHotels({
          destination: '',
          checkInDate: '',
          checkOutDate: '',
        });
        if (isMounted && res && res.hotels) {
          setHotels(res.hotels);
        }
      } catch (err) {
        console.error('Failed to fetch hotels from database:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    fetchHotels();
    return () => {
      isMounted = false;
    };
  }, []);

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
            Live inventory directly from verified property partners
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

      {/* Grid of Hotel Cards or Clean Empty State */}
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
      ) : hotels.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {hotels.map((hotel) => (
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
                  src={hotel.thumbnailUrl || hotel.imageUrl}
                  alt={hotel.name}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  <span className="rounded-md bg-stone-900/85 backdrop-blur-xs px-2.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                    {hotel.city}
                  </span>
                  <span className="rounded-md bg-[#C25E34] px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
                    {hotel.propertyType || 'HOTEL'}
                  </span>
                </div>

                {/* Rating Badge */}
                <div
                  className={`absolute bottom-3 left-3 flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold shadow-sm border backdrop-blur-xs ${
                    isDark
                      ? 'bg-[#181126]/90 border-white/20 text-white'
                      : 'bg-white/95 border-stone-200 text-stone-900'
                  }`}
                >
                  <span className="rounded bg-amber-500 px-1.5 py-0.5 text-[10px] font-black text-white">
                    ★ {hotel.userRating || 4.8}
                  </span>
                  <span className={`text-[11px] font-semibold ${isDark ? 'text-stone-300' : 'text-stone-600'}`}>
                    ({hotel.reviewCount || 0} reviews)
                  </span>
                </div>
              </div>

              {/* Card Details */}
              <div className="flex flex-1 flex-col justify-between p-4.5">
                <div>
                  <h3 className="text-base font-bold line-clamp-1 group-hover:text-[#C25E34] transition-colors">
                    {hotel.name}
                  </h3>
                  <div className="flex items-center gap-1 mt-1 text-xs text-stone-500">
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-stone-400" />
                    <span className="line-clamp-1">{hotel.area || hotel.city}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-200/60 dark:border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-stone-500 uppercase tracking-wide block">Starting from</span>
                    <span className="text-lg font-bold text-stone-900 dark:text-white">
                      ₹{(hotel.pricePerNight || 4500).toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-stone-400"> / night</span>
                  </div>

                  <Link
                    href={`/hotels/detail/${hotel.id}`}
                    className="rounded-lg bg-[#C25E34] hover:bg-[#A84F2A] px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs transition-colors"
                  >
                    View Stay
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
          <Building2 className="h-12 w-12 text-[#C25E34] mb-3" />
          <h3 className="text-lg font-bold text-stone-900 dark:text-white">No properties listed yet</h3>
          <p className="text-sm max-w-md mt-1 mb-5 text-stone-500 dark:text-stone-400">
            All mock data has been removed. You can now register as a partner to list your hotel, resort, or homestay directly into the database.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/partner"
              className="inline-flex items-center gap-2 rounded-xl bg-[#C25E34] hover:bg-[#A84F2A] px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors"
            >
              <PlusCircle className="h-4 w-4" />
              <span>List Your Property (Partner Portal)</span>
            </Link>
            <Link
              href="/admin/dashboard"
              className={`inline-flex items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-semibold transition-colors ${
                isDark ? 'border-white/20 text-white hover:bg-white/10' : 'border-stone-300 text-stone-800 hover:bg-stone-100'
              }`}
            >
              <span>Super Admin Console</span>
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
