'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, CreditCard, Heart, Plane, Car } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export default function Footer() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <footer
      className={`transition-colors duration-300 pt-14 pb-8 border-t ${
        isDark
          ? 'bg-[#0A0610] text-purple-200/80 border-purple-950/40'
          : 'bg-[#F5F2ED] text-stone-600 border-stone-200'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top Link Columns */}
        <div
          className={`grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 pb-12 border-b text-xs ${
            isDark ? 'border-purple-950/40' : 'border-stone-200'
          }`}
        >
          {/* Brand Info */}
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-3">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-2xl shadow-md ${
                  isDark
                    ? 'bg-gradient-to-tr from-[#701A75] via-[#831843] to-[#A855F7] text-white shadow-purple-950/50'
                    : 'bg-gradient-to-tr from-[#C2410C] to-[#F59E0B] text-white'
                }`}
              >
                <span className="font-editorial-serif text-xl font-black italic">W</span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-xl font-black tracking-tight font-sans ${
                    isDark ? 'text-white' : 'text-stone-900'
                  }`}
                >
                  Wander<span className={isDark ? 'text-[#C084FC]' : 'text-[#C2410C]'}>Stay</span>
                </span>
                <span
                  className={`rounded-full px-2 py-0.2 text-[9px] font-black uppercase tracking-widest ${
                    isDark
                      ? 'bg-purple-500/20 text-[#E9D5FF] border border-purple-500/40'
                      : 'bg-orange-100 text-[#C2410C] border border-orange-200'
                  }`}
                >
                  PREMIUM
                </span>
              </div>
            </Link>
            <p className={`text-xs leading-relaxed max-w-sm mb-4 font-normal ${isDark ? 'text-purple-200/60' : 'text-stone-500'}`}>
              India&apos;s distinctive travel booking ecosystem for handpicked resorts, luxury villas, 
              verified homestays, and reliable highway cabs with guaranteed best price assurance.
            </p>
            <div className={`flex items-center gap-3 text-xs ${isDark ? 'text-purple-200/60' : 'text-stone-500'}`}>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-amber-500" /> 100% Verified
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Lock className="h-4 w-4 text-purple-400" /> 256-bit Encrypted
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <CreditCard className="h-4 w-4 text-amber-500" /> GST Invoicing SAC 9963/9964
              </span>
            </div>
          </div>

          {/* Hotel Destinations */}
          <div>
            <h4 className={`text-xs font-bold uppercase tracking-wider mb-3 ${isDark ? 'text-white' : 'text-stone-900'}`}>
              Popular Destinations
            </h4>
            <ul className={`space-y-2 ${isDark ? 'text-purple-200/60' : 'text-stone-500'}`}>
              <li>
                <Link href="/hotels/listing?destination=Goa" className="hover:text-purple-300 transition-colors">
                  Hotels &amp; Resorts in Goa
                </Link>
              </li>
              <li>
                <Link href="/hotels/listing?destination=Jaipur" className="hover:text-purple-300 transition-colors">
                  Heritage Haveli in Jaipur
                </Link>
              </li>
              <li>
                <Link href="/hotels/listing?destination=Mumbai" className="hover:text-purple-300 transition-colors">
                  Luxury Suites in Mumbai
                </Link>
              </li>
              <li>
                <Link href="/hotels/listing?destination=Manali" className="hover:text-purple-300 transition-colors">
                  Snow Escapes in Manali
                </Link>
              </li>
            </ul>
          </div>

          {/* Cab Routes */}
          <div>
            <h4 className={`text-xs font-bold uppercase tracking-wider mb-3 ${isDark ? 'text-white' : 'text-stone-900'}`}>
              Popular Highway Cabs
            </h4>
            <ul className={`space-y-2 ${isDark ? 'text-purple-200/60' : 'text-stone-500'}`}>
              <li>
                <Link href="/cabs/listing?from=New+Delhi&to=Agra" className="hover:text-purple-300 transition-colors">
                  Delhi &rarr; Agra Taj Express
                </Link>
              </li>
              <li>
                <Link href="/cabs/listing?from=Mumbai&to=Pune" className="hover:text-purple-300 transition-colors">
                  Mumbai &rarr; Pune Expressway
                </Link>
              </li>
              <li>
                <Link href="/cabs/listing?from=Bengaluru&to=Mysuru" className="hover:text-purple-300 transition-colors">
                  Bengaluru &rarr; Mysuru Corridor
                </Link>
              </li>
              <li>
                <Link href="/cabs/listing?from=Chandigarh&to=Shimla" className="hover:text-purple-300 transition-colors">
                  Chandigarh &rarr; Shimla Hills
                </Link>
              </li>
            </ul>
          </div>

          {/* Business & Portals */}
          <div>
            <h4 className={`text-xs font-bold uppercase tracking-wider mb-3 ${isDark ? 'text-white' : 'text-stone-900'}`}>
              Business &amp; Portals
            </h4>
            <ul className={`space-y-2 ${isDark ? 'text-purple-200/60' : 'text-stone-500'}`}>
              <li>
                <Link href="/partner" className="hover:text-purple-300 transition-colors font-semibold">
                  Partner Central (Hotels &amp; Cabs)
                </Link>
              </li>
              <li>
                <Link href="/admin/dashboard" className="hover:text-purple-300 transition-colors">
                  Super Admin Governance
                </Link>
              </li>
              <li>
                <Link href="/offers" className="hover:text-purple-300 transition-colors">
                  Bank Deals &amp; Vouchers
                </Link>
              </li>
              <li>
                <Link href="/support" className="hover:text-purple-300 transition-colors">
                  24x7 Help Center &amp; SOS
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Rights Bar */}
        <div className={`mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs ${isDark ? 'text-purple-200/50' : 'text-stone-500'}`}>
          <p>© 2026 WanderStay Oasis Technologies Pvt Ltd. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#privacy" className="hover:underline">Privacy Policy</a>
            <a href="#terms" className="hover:underline">Terms of Service</a>
            <a href="#sitemap" className="hover:underline">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
