'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

const DESTINATIONS = [
  {
    id: 'goa',
    name: 'Goa',
    tagline: 'Beach & Relax',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'manali',
    name: 'Manali',
    tagline: 'Mountains & Snow',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'jaipur',
    name: 'Jaipur',
    tagline: 'Heritage & Culture',
    image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'udaipur',
    name: 'Udaipur',
    tagline: 'Lakes & Palaces',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop&q=80',
  },
];

export default function PopularDestinationsSection() {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-8 sm:pb-10">
      {/* Section Header matching user reference screenshot */}
      <div className="flex items-center justify-between mb-4">
        <h2
          className={`text-xl sm:text-2xl font-bold tracking-tight font-sans ${
            isDark ? 'text-white' : 'text-[#18181B]'
          }`}
        >
          Popular Destinations
        </h2>

        <Link
          href="/hotels/listing?destination=Goa"
          className={`flex items-center gap-1 text-xs font-semibold hover:underline ${
            isDark ? 'text-purple-300' : 'text-stone-700 hover:text-stone-900'
          }`}
        >
          <span>Explore All</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* 4 Cards Grid matching user screenshot */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
        {DESTINATIONS.map((dest) => (
          <div
            key={dest.id}
            onClick={() => router.push(`/hotels/listing?destination=${encodeURIComponent(dest.name)}`)}
            className={`group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 transform hover:-translate-y-1 shadow-md hover:shadow-xl ${
              isDark ? 'border border-white/10' : 'border border-stone-200/80'
            }`}
          >
            <div className="relative h-36 sm:h-40 w-full overflow-hidden bg-stone-900">
              <img
                src={dest.image}
                alt={dest.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
            </div>

            <div className="absolute bottom-0 inset-x-0 p-3.5 sm:p-4 text-white">
              <h3 className="text-base sm:text-lg font-bold tracking-tight text-white leading-snug">
                {dest.name}
              </h3>
              <p className="text-xs text-white/80 font-normal leading-none mt-1">
                {dest.tagline}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
