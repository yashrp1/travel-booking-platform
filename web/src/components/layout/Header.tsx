'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Hotel,
  Car,
  Search,
  Bell,
  Briefcase,
  User,
  LogOut,
  ChevronDown,
  ShieldCheck,
  Sun,
  Moon,
} from 'lucide-react';
import AuthModal, { CustomerProfile } from '@/components/auth/AuthModal';
import { useTheme } from '@/context/ThemeContext';

interface HeaderProps {
  activeTab: 'hotels' | 'cabs';
  onTabChange: (tab: 'hotels' | 'cabs') => void;
}

const SUPPORTED_CURRENCIES = [
  { code: 'INR', symbol: '₹', label: 'India (INR)', flag: '🇮🇳' },
  { code: 'USD', symbol: '$', label: 'United States (USD)', flag: '🇺🇸' },
  { code: 'EUR', symbol: '€', label: 'Europe (EUR)', flag: '🇪🇺' },
  { code: 'GBP', symbol: '£', label: 'United Kingdom (GBP)', flag: '🇬🇧' },
  { code: 'AED', symbol: 'د.إ', label: 'UAE (AED)', flag: '🇦🇪' },
];

export default function Header({ activeTab, onTabChange }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [user, setUser] = useState<CustomerProfile | null>(null);
  const [selectedCurrency, setSelectedCurrency] = useState(SUPPORTED_CURRENCIES[0]);
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);
  const currencyMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkUser = () => {
      try {
        const stored = localStorage.getItem('wanderstay_customer_profile');
        if (stored) {
          setUser(JSON.parse(stored));
        } else {
          setUser(null);
        }
      } catch (e) {
        console.error(e);
      }
    };

    const checkCurrency = () => {
      try {
        const storedCur = localStorage.getItem('wanderstay_currency');
        if (storedCur) {
          const found = SUPPORTED_CURRENCIES.find((c) => c.code === storedCur);
          if (found) setSelectedCurrency(found);
        }
      } catch (e) {
        console.error(e);
      }
    };

    checkUser();
    checkCurrency();

    window.addEventListener('wanderstay_auth_changed', checkUser);
    window.addEventListener('storage', checkUser);

    const handleClickOutside = (e: MouseEvent) => {
      if (currencyMenuRef.current && !currencyMenuRef.current.contains(e.target as Node)) {
        setIsCurrencyDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('wanderstay_auth_changed', checkUser);
      window.removeEventListener('storage', checkUser);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    try {
      localStorage.removeItem('wanderstay_customer_profile');
      window.dispatchEvent(new Event('wanderstay_auth_changed'));
    } catch (e) {
      console.error(e);
    }
    setUser(null);
  };

  const handleSelectCurrency = (cur: typeof SUPPORTED_CURRENCIES[0]) => {
    setSelectedCurrency(cur);
    setIsCurrencyDropdownOpen(false);
    try {
      localStorage.setItem('wanderstay_currency', cur.code);
    } catch (e) {
      console.error(e);
    }
  };

  const isDark = theme === 'dark';

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-colors duration-200 ${
          isDark
            ? 'bg-[#0F0A18]/90 text-white border-b border-white/10 backdrop-blur-md shadow-lg'
            : 'bg-white/95 text-stone-900 border-b border-stone-200/80 backdrop-blur-md shadow-2xs'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-18 sm:h-20">
          {/* 1. Left: Brand Logo matching the user's reference screenshot */}
          <Link href="/" className="flex items-center gap-2.5 group">
            {/* Terracotta/Copper Folded Ribbon 'W' Brandmark */}
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-xl shadow-xs transition-transform group-hover:scale-105 ${
                isDark
                  ? 'bg-gradient-to-tr from-[#9333EA] to-[#C2410C] text-white'
                  : 'bg-gradient-to-tr from-[#C25E34] to-[#E07A4F] text-white'
              }`}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5"
              >
                <path d="M4 8l4 8 4-8 4 8 4-8" />
              </svg>
            </div>
            <span
              className={`text-xl sm:text-2xl font-bold tracking-tight font-sans ${
                isDark ? 'text-white' : 'text-[#18181B]'
              }`}
            >
              WanderStay
            </span>
          </Link>

          {/* 2. Center: Navigation Links (Stays, Cabs, Destinations, Offers) */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold">
            <button
              onClick={() => onTabChange('hotels')}
              className={`transition-colors cursor-pointer ${
                activeTab === 'hotels'
                  ? isDark
                    ? 'text-white font-bold'
                    : 'text-[#18181B] font-bold'
                  : isDark
                  ? 'text-stone-400 hover:text-white'
                  : 'text-stone-600 hover:text-[#18181B]'
              }`}
            >
              Stays
            </button>

            <button
              onClick={() => onTabChange('cabs')}
              className={`transition-colors cursor-pointer ${
                activeTab === 'cabs'
                  ? isDark
                    ? 'text-white font-bold'
                    : 'text-[#18181B] font-bold'
                  : isDark
                  ? 'text-stone-400 hover:text-white'
                  : 'text-stone-600 hover:text-[#18181B]'
              }`}
            >
              Cabs
            </button>

            <Link
              href="/buses"
              className={`transition-colors cursor-pointer ${
                activeTab === ('buses' as any)
                  ? isDark
                    ? 'text-white font-bold'
                    : 'text-[#18181B] font-bold'
                  : isDark
                  ? 'text-stone-400 hover:text-white'
                  : 'text-stone-600 hover:text-[#18181B]'
              }`}
            >
              Buses
            </Link>

            <Link
              href="/hotels/listing?destination=Goa"
              className={`transition-colors ${
                isDark ? 'text-stone-400 hover:text-white' : 'text-stone-600 hover:text-[#18181B]'
              }`}
            >
              Destinations
            </Link>

            <Link
              href="/offers"
              className={`transition-colors ${
                isDark ? 'text-stone-400 hover:text-white' : 'text-stone-600 hover:text-[#18181B]'
              }`}
            >
              Offers
            </Link>
          </nav>

          {/* 3. Right: Utility & Action Items (Search, Bell, Currency, Theme Toggle, Sign In) */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Search Icon Button */}
            <Link
              href="/hotels/listing?destination=Goa"
              title="Search Destinations"
              className={`p-2 rounded-full transition-colors ${
                isDark
                  ? 'text-stone-300 hover:bg-white/10 hover:text-white'
                  : 'text-stone-700 hover:bg-stone-100 hover:text-stone-900'
              }`}
            >
              <Search className="h-4.5 w-4.5" />
            </Link>

            {/* Notification Bell with Red Badge */}
            <div className="relative">
              <button
                type="button"
                title="Notifications"
                className={`p-2 rounded-full transition-colors cursor-pointer ${
                  isDark
                    ? 'text-stone-300 hover:bg-white/10 hover:text-white'
                    : 'text-stone-700 hover:bg-stone-100 hover:text-stone-900'
                }`}
              >
                <Bell className="h-4.5 w-4.5" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#EF4444]" />
              </button>
            </div>

            {/* Currency Selector */}
            <div className="relative hidden sm:block" ref={currencyMenuRef}>
              <button
                type="button"
                onClick={() => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                  isDark
                    ? 'border-white/15 bg-white/5 text-stone-200 hover:bg-white/10'
                    : 'border-stone-200/90 bg-white text-stone-700 hover:bg-stone-50 shadow-2xs'
                }`}
              >
                <span>{selectedCurrency.flag}</span>
                <span>{selectedCurrency.code}</span>
                <ChevronDown className="h-3 w-3 text-stone-400" />
              </button>

              {isCurrencyDropdownOpen && (
                <div
                  className={`absolute right-0 mt-2 w-44 rounded-2xl p-1.5 shadow-xl border z-50 ${
                    isDark
                      ? 'bg-[#181126] border-white/15 text-white'
                      : 'bg-white border-stone-200 text-stone-800'
                  }`}
                >
                  {SUPPORTED_CURRENCIES.map((cur) => (
                    <button
                      key={cur.code}
                      type="button"
                      onClick={() => handleSelectCurrency(cur)}
                      className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                        selectedCurrency.code === cur.code
                          ? isDark
                            ? 'bg-purple-950/60 text-purple-300 font-bold'
                            : 'bg-orange-50 text-[#C25E34] font-bold'
                          : isDark
                          ? 'hover:bg-white/5 text-stone-300'
                          : 'hover:bg-stone-50 text-stone-700'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{cur.flag}</span>
                        <span>{cur.code}</span>
                      </span>
                      <span className="text-[11px] text-stone-400">{cur.symbol}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dark / Light Mode Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle theme"
              className={`p-2 rounded-full border transition-all cursor-pointer ${
                isDark
                  ? 'border-white/15 bg-white/5 text-amber-300 hover:bg-white/10 hover:text-amber-200'
                  : 'border-stone-200/90 bg-white text-stone-700 hover:bg-stone-100 hover:text-stone-900 shadow-2xs'
              }`}
            >
              {isDark ? (
                <Sun className="h-4.5 w-4.5 transition-transform duration-300" />
              ) : (
                <Moon className="h-4.5 w-4.5 transition-transform duration-300" />
              )}
            </button>

            {/* Sign In / User Profile Button matching screenshot */}
            {user ? (
              <div className="flex items-center gap-2">
                <div
                  className={`flex items-center gap-2 rounded-full pl-1 pr-3 py-1 text-xs font-bold border ${
                    isDark
                      ? 'bg-white/10 text-white border-white/20'
                      : 'bg-stone-100 text-stone-900 border-stone-200'
                  }`}
                >
                  <div className="h-6 w-6 rounded-full bg-[#C25E34] text-white flex items-center justify-center text-[10px] font-black">
                    {user.name.charAt(0)}
                  </div>
                  <span>{user.name.split(' ')[0]}</span>
                </div>
                <button
                  onClick={handleLogout}
                  title="Sign Out"
                  className="rounded-full p-1 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthOpen(true)}
                className={`rounded-full px-5 py-2 text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-xs ${
                  isDark
                    ? 'bg-white text-[#0F0A18] hover:bg-stone-200 font-bold'
                    : 'bg-[#18181B] text-white hover:bg-black font-semibold'
                }`}
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Customer Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={(newUser) => setUser(newUser)}
      />
    </>
  );
}
