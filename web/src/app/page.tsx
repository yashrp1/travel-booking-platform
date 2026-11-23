'use client';

import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import HeroSearchContainer from '@/components/home/HeroSearchContainer';
import PopularDestinationsSection from '@/components/home/PopularDestinationsSection';
import OffersSection from '@/components/home/OffersSection';
import FeaturedHotels from '@/components/home/FeaturedHotels';
import CabFleetShowcase from '@/components/home/CabFleetShowcase';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import Footer from '@/components/layout/Footer';
import { useTheme } from '@/context/ThemeContext';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'hotels' | 'cabs'>('hotels');
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div
      className={`min-h-screen flex flex-col justify-between transition-colors duration-200 ${
        isDark ? 'bg-[#0F0A18] text-white' : 'bg-[#FAF8F5] text-stone-900'
      }`}
    >
      {/* 1. Header matching the user's reference image */}
      <Header activeTab={activeTab} onTabChange={(tab) => setActiveTab(tab)} />

      <main className="flex-1 pb-16">
        {/* =========================================================================
            2. HERO SECTION (Exact pixel replica of Clean Minimal reference mockup)
            Features the Alpine traveler vista, left-aligned editorial serif typography,
            and connected floating search card directly below subtitle.
           ========================================================================= */}
        <section className="relative z-10 overflow-hidden pt-6 sm:pt-8 lg:pt-9 pb-8 sm:pb-10 lg:pb-12">
          {/* Panoramic Mountain Background Image with traveler on right viewpoint */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <img
              src="/images/hero-mountains.jpg"
              alt="Mountain Traveler Journey"
              className={`h-full w-full object-cover object-[78%_30%] transition-opacity duration-500 ${
                isDark ? 'opacity-40 filter saturate-120' : 'opacity-100'
              }`}
            />
            {/* Subtle soft gradient on the left so typography is crisp without drowning out the background */}
            {isDark ? (
              <div className="absolute inset-0 bg-gradient-to-r from-[#0F0A18]/95 via-[#0F0A18]/70 via-55% to-transparent" />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-r from-[#FAF8F5]/90 via-[#FAF8F5]/45 via-48% to-transparent" />
            )}
            {/* Seamless subtle transition to Popular Destinations */}
            <div
              className={`absolute bottom-0 inset-x-0 h-8 bg-gradient-to-t ${
                isDark ? 'from-[#0F0A18] to-transparent' : 'from-[#FAF8F5] to-transparent'
              }`}
            />
          </div>

          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-left">
              {/* Text column matching reference screenshot */}
              <div className="max-w-[620px]">
                {/* Kicker from screenshot: TRAVEL MADE SIMPLE */}
                <span
                  className={`text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.22em] block mb-1.5 font-sans ${
                    isDark ? 'text-purple-400' : 'text-[#C25E34]'
                  }`}
                >
                  TRAVEL MADE SIMPLE
                </span>

                {/* Main Headline from screenshot with editorial serif */}
                <h1
                  className={`text-[28px] sm:text-[36px] lg:text-[42px] font-editorial-serif font-bold tracking-tight leading-[1.08] ${
                    isDark ? 'text-white' : 'text-[#18181B]'
                  }`}
                >
                  Discover Stays &amp; Rides <br className="hidden sm:inline" />
                  for Your{' '}
                  <span className={isDark ? 'text-[#C084FC]' : 'text-[#C25E34]'}>
                    Next Journey
                  </span>
                </h1>

                {/* Subtitle from screenshot */}
                <p
                  className={`mt-2 text-xs sm:text-sm max-w-md font-normal leading-relaxed ${
                    isDark ? 'text-stone-300' : 'text-stone-600'
                  }`}
                >
                  From cozy homestays to outstation cabs — plan your perfect trip, all in one place.
                </p>
              </div>

              {/* Connected Search Card - Compact, harmonious positioning right below subhead */}
              <div className="mt-5 sm:mt-6 w-full max-w-[840px]">
                <HeroSearchContainer
                  activeCategory={activeTab}
                  onCategoryChange={(tab) => setActiveTab(tab)}
                />
              </div>
            </div>
          </div>
        </section>

        {/* 3. Popular Destinations Section directly underneath (Goa, Manali, Jaipur, Udaipur) */}
        <div className="pt-2 sm:pt-4">
          <PopularDestinationsSection />
        </div>

        {/* 4. Active Offers & Vouchers Carousel */}
        <OffersSection />

        {/* 5. Featured Hotels & Homestays Showcase */}
        <FeaturedHotels />

        {/* 6. Commercial Cab Fleet Showcase */}
        <CabFleetShowcase />

        {/* 7. Why Choose Us Trust Signals */}
        <WhyChooseUs />
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
