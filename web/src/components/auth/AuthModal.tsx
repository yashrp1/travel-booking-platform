'use client';

import React, { useState, useEffect } from 'react';
import { X, Phone, CheckCircle2, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export interface CustomerProfile {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  tier: string;
  walletCoins: number;
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: CustomerProfile) => void;
  initialPhone?: string;
  initialName?: string;
  initialEmail?: string;
}

export default function AuthModal({
  isOpen,
  onClose,
  onSuccess,
  initialPhone = '',
  initialName = 'Rahul Sharma',
  initialEmail = 'rahul.sharma@example.com',
}: AuthModalProps) {
  const [phone, setPhone] = useState(initialPhone);
  const [fullName, setFullName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [otpStep, setOtpStep] = useState(false);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialPhone) setPhone(initialPhone);
    if (initialName) setFullName(initialName);
    if (initialEmail) setEmail(initialEmail);
  }, [initialPhone, initialName, initialEmail]);

  if (!isOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setError('Please enter a valid 10-digit Indian mobile number');
      return;
    }
    setError('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOtpStep(true);
      setOtp('123456'); // Pre-fill test OTP for instantaneous testability
    }, 400);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp !== '123456' && otp.length !== 6) {
      setError('Invalid OTP. Use demo OTP: 123456');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const clean = phone.replace(/\D/g, '');
      const parts = fullName.trim().split(' ');
      const fName = parts[0] || 'Rahul';
      const lName = parts.slice(1).join(' ') || 'Sharma';

      const profile: CustomerProfile = {
        id: 'usr_' + Date.now(),
        name: fullName.trim() || 'Rahul Sharma',
        firstName: fName,
        lastName: lName,
        phone: '+91 ' + (clean || '9876543210'),
        email: email.trim() || 'rahul.sharma@example.com',
        tier: 'Platinum Member',
        walletCoins: 1250,
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem('wanderstay_customer_profile', JSON.stringify(profile));
        window.dispatchEvent(new Event('wanderstay_auth_changed'));
      }

      onSuccess(profile);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl border border-stone-200">
        {/* Header Banner */}
        <div className="bg-[#18181B] p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 rounded-full p-1.5 text-white/70 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-[#C25E34]/20 border border-[#C25E34]/40 px-2.5 py-0.5 text-[10px] font-black tracking-widest uppercase text-[#C25E34]">
              <Sparkles className="h-3 w-3" />
              WANDERSTAY PRIVILEGE
            </span>
          </div>
          <h3 className="text-xl font-bold tracking-tight text-white font-sans">Sign In or Register</h3>
          <p className="text-xs text-stone-300 mt-1">
            Unlock lowest rates, instant vouchers &amp; zero-cancellation protection
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {!otpStep ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                  Enter Mobile Number
                </label>
                <div className="flex rounded-xl border border-stone-300 focus-within:border-[#C25E34] focus-within:ring-2 focus-within:ring-[#C25E34]/20 overflow-hidden shadow-xs">
                  <span className="flex items-center bg-stone-100 px-3.5 text-sm font-bold text-stone-900 border-r border-stone-200">
                    +91
                  </span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      setError('');
                    }}
                    placeholder="98765 43210"
                    maxLength={10}
                    className="w-full px-3 py-2.5 text-sm font-semibold text-stone-900 focus:outline-none"
                    autoFocus
                  />
                </div>
                {error && <p className="mt-1.5 text-xs text-red-600 font-medium">{error}</p>}
              </div>

              <div className="rounded-xl bg-orange-50/60 border border-orange-100 p-3 text-xs text-stone-800 flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-[#C25E34] shrink-0 mt-0.5" />
                <span>We&apos;ll verify your account securely via a 6-digit WhatsApp/SMS OTP.</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#C25E34] hover:bg-[#A84F2A] text-white rounded-xl py-3 text-sm font-bold disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all"
              >
                {loading ? 'Sending OTP...' : 'Send Verification OTP'}
                <ArrowRight className="h-4 w-4" />
              </button>

              <div className="text-center text-xs text-stone-500 pt-2">
                By continuing, you accept WanderStay&apos;s{' '}
                <a href="#terms" className="text-[#C25E34] underline font-semibold">
                  Terms of Service
                </a>{' '}
                &amp;{' '}
                <a href="#privacy" className="text-[#C25E34] underline font-semibold">
                  Privacy Policy
                </a>.
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
                    Enter 6-Digit OTP
                  </label>
                  <button
                    type="button"
                    onClick={() => setOtpStep(false)}
                    className="text-xs text-[#C25E34] hover:underline font-bold"
                  >
                    Change Number
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    placeholder="123456"
                    className="w-full text-center tracking-widest text-2xl font-black px-3 py-2.5 rounded-xl border border-stone-300 focus:border-[#C25E34] focus:ring-2 focus:ring-[#C25E34]/20 focus:outline-none"
                    autoFocus
                  />
                </div>
                {error && <p className="mt-1.5 text-xs text-red-600 font-medium">{error}</p>}
                <div className="mt-2.5 rounded-lg bg-orange-50 border border-orange-200/60 p-2 flex items-center justify-between text-xs">
                  <span className="text-stone-700">Demo Instant Code:</span>
                  <span className="font-bold text-[#C25E34] tracking-wider bg-white px-2 py-0.5 rounded border border-orange-300">123456</span>
                </div>
              </div>

              {/* Guest Profile Details */}
              <div className="space-y-3 pt-1 border-t border-stone-200">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-3 py-2 text-xs font-semibold text-stone-900 border border-stone-300 rounded-lg focus:outline-none focus:border-[#C25E34]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-3 py-2 text-xs font-semibold text-stone-900 border border-stone-300 rounded-lg focus:outline-none focus:border-[#C25E34]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#C25E34] hover:bg-[#A84F2A] text-white rounded-xl py-3 text-sm font-bold disabled:opacity-50 cursor-pointer shadow-md transition-all"
              >
                {loading ? 'Verifying...' : 'Confirm & Sign In'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
