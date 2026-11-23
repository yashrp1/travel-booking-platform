'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import {
  Car,
  Users,
  Briefcase,
  Wind,
  ShieldCheck,
  CheckCircle2,
  ChevronDown,
  Info,
  ArrowRight,
  Clock,
  MapPin,
  Loader2,
} from 'lucide-react';
import { CAB_FLEET, CabPackage } from '@/data/mock-data';
import { apiClient } from '@/lib/api-client';

function CabListingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const tripType = searchParams.get('tripType') || 'ONE_WAY';
  const fromCity = searchParams.get('from') || 'New Delhi';
  const toCity = searchParams.get('to') || 'Agra';
  const dateParam = searchParams.get('date') || '2026-11-12';
  const timeParam = searchParams.get('time') || '07:00 AM';
  const flightParam = searchParams.get('flight');
  const terminalParam = searchParams.get('terminal');
  const meetParam = searchParams.get('meetAndGreet') === 'true';

  // Distance & Options from API
  const [estimatedDistance, setEstimatedDistance] = useState<number>(240);
  const [selectedCabId, setSelectedCabId] = useState<string>(CAB_FLEET[1].id); // Sedan by default
  const [selectedCabDetails, setSelectedCabDetails] = useState<CabPackage | null>(null);
  const [isBooking, setIsBooking] = useState<boolean>(false);

  useEffect(() => {
    let active = true;
    async function fetchQuote() {
      try {
        const quote = await apiClient.getCabQuote({
          tripType,
          pickupLocation: fromCity,
          dropLocation: toCity,
          departureDate: dateParam,
          pickupTime: timeParam,
        });
        if (active && quote && quote.estimatedDistanceKm) {
          setEstimatedDistance(quote.estimatedDistanceKm);
        }
      } catch {
        // Fallback to default
      }
    }
    fetchQuote();
    return () => {
      active = false;
    };
  }, [tripType, fromCity, toCity, dateParam, timeParam]);

  const handleBookCab = async (cab: CabPackage) => {
    setIsBooking(true);
    try {
      const baseFare = Math.round(cab.baseFareOneWayPerKm * estimatedDistance);
      const tollTaxes = Math.round(cab.driverAllowancePerDay || 450);

      const booking = await apiClient.initiateCabBooking({
        cabCategoryId: cab.category.toLowerCase(),
        tripType,
        sourceCity: fromCity,
        destinationCity: toCity,
        pickupDate: dateParam,
        pickupTime: timeParam,
        passengerName: 'Rohit Verma',
        passengerPhone: '+91 98765 43210',
        passengerEmail: 'rohit.verma@example.com',
        pickupAddress: `${fromCity} Airport / Central Location`,
        dropAddress: `${toCity} Central Drop Point`,
        baseFare,
        tollTaxes,
        couponCode: 'CABRUSH',
      });

      router.push(
        `/cabs/confirmation?ref=${booking.bookingReference}&cab=${encodeURIComponent(
          cab.name
        )}&category=${cab.category}&from=${encodeURIComponent(
          fromCity
        )}&to=${encodeURIComponent(toCity)}&fare=${booking.totalPayable}&date=${dateParam}&time=${encodeURIComponent(
          timeParam
        )}`
      );
    } catch {
      const totalFare = Math.round(cab.baseFareOneWayPerKm * estimatedDistance + cab.driverAllowancePerDay);
      router.push(
        `/cabs/confirmation?ref=MMT-CAB-${Math.floor(100000 + Math.random() * 900000)}&cab=${encodeURIComponent(
          cab.name
        )}&category=${cab.category}&from=${encodeURIComponent(
          fromCity
        )}&to=${encodeURIComponent(toCity)}&fare=${totalFare}&date=${dateParam}&time=${encodeURIComponent(
          timeParam
        )}`
      );
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#F4F6F8]">
      <Header activeTab="cabs" onTabChange={(t) => router.push(t === 'hotels' ? '/hotels/listing' : '/')} />

      {/* Top Search Modifier Bar */}
      <div className="bg-[#18181B] text-white py-3 border-b border-blue-900 sticky top-[64px] z-30 shadow-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4 text-xs sm:text-sm">
            <div>
              <span className="text-[10px] uppercase font-bold text-blue-300 tracking-wider block">
                Trip Route
              </span>
              <strong className="text-white text-sm sm:text-base font-black tracking-wide">
                {fromCity} &rarr; {toCity}
              </strong>
            </div>

            <div className="h-6 w-px bg-white/20 hidden sm:block" />

            <div>
              <span className="text-[10px] uppercase font-bold text-blue-300 tracking-wider block">
                Departure
              </span>
              <span className="text-gray-200 font-semibold">
                {dateParam} at {timeParam}
              </span>
            </div>

            <div className="h-6 w-px bg-white/20 hidden sm:block" />

            <div>
              <span className="text-[10px] uppercase font-bold text-blue-300 tracking-wider block">
                Est. Distance
              </span>
              <span className="text-emerald-400 font-bold">
                ~{estimatedDistance} km (4 hrs 15 mins)
              </span>
            </div>
          </div>

          <Link
            href="/"
            className="rounded-full bg-[#C25E34] text-[#18181B] hover:bg-[#A84F2A] px-4 py-1.5 text-xs font-bold text-white transition-colors uppercase tracking-wider cursor-pointer"
          >
            Modify Route
          </Link>
        </div>
      </div>

      {/* Main Cabs Stream */}
      <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="text-2xl font-black text-slate-900">
              Available Cabs for {fromCity} to {toCity}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Guaranteed on-time pickup • Police-verified chauffeurs • Instant confirmation
            </p>
          </div>
          <span className="text-xs text-stone-700 font-bold flex items-center gap-1.5 bg-stone-100 border border-stone-200 px-3 py-1.5 rounded-full self-start sm:self-auto">
            <CheckCircle2 className="h-4 w-4 text-amber-500" />
            Zero Hidden Driver Charges
          </span>
        </div>

        {/* Airport Flight Tracking Banner (MakeMyTrip Feature) */}
        {flightParam && (
          <div className="rounded-xl bg-stone-100 border border-stone-300 p-3 flex flex-wrap items-center justify-between gap-2 text-xs text-stone-900 font-bold shadow-xs">
            <div className="flex items-center gap-2">
              <span className="text-base">✈️</span>
              <span>
                Airport Flight Auto-Sync Active: <strong className="text-stone-800">{flightParam}</strong> ({terminalParam || 'Terminal Arrivals'})
              </span>
            </div>
            {meetParam && (
              <span className="bg-[#C25E34] text-[#18181B] text-[10px] uppercase font-black px-2.5 py-1 rounded-full shadow-2xs">
                🤝 Chauffeur Placard Meet &amp; Greet
              </span>
            )}
          </div>
        )}

        {/* Chauffeur Trust Banner (MakeMyTrip signature assurance) */}
        <div className="rounded-xl bg-blue-50/70 border border-blue-100 p-3 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-700">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-[#C25E34]" />
            <strong className="text-slate-900">WanderStay Cab Promise:</strong>
            <span>Police-verified drivers</span>
            <span>•</span>
            <span>Pre-trip sanitization</span>
            <span>•</span>
            <span>No surge pricing guarantee</span>
          </div>
          <span className="text-[11px] font-bold text-[#C25E34] bg-white px-2 py-0.5 rounded shadow-xs">4.9★ Driver Rating</span>
        </div>

        {/* Cabs List */}
        <div className="space-y-4">
          {CAB_FLEET.map((cab) => {
            const calculatedFare = Math.round(
              cab.baseFareOneWayPerKm * estimatedDistance + cab.driverAllowancePerDay
            );
            return (
              <div
                key={cab.id}
                className="rounded-2xl bg-white border border-slate-200/90 p-5 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              >
                {/* Left Vehicle Image & Category */}
                <div className="flex items-center gap-4">
                  <div className="h-24 w-36 rounded-xl bg-slate-50 overflow-hidden shrink-0 border border-slate-200 p-1 flex items-center justify-center">
                    <img
                      src={cab.imageUrl}
                      alt={cab.name}
                      className="h-full w-full object-cover rounded-lg"
                    />
                  </div>
                  <div>
                    <span className="rounded bg-slate-900 text-white px-2 py-0.5 text-[10px] font-black uppercase tracking-wider">
                      {cab.category}
                    </span>
                    <h3 className="text-xl font-black text-slate-900 mt-1">
                      {cab.name}
                    </h3>
                    <p className="text-xs text-slate-500">{cab.modelExamples}</p>

                    {/* Capacity Specs */}
                    <div className="mt-2 flex items-center gap-3 text-xs text-slate-600">
                      <span className="flex items-center gap-1 font-semibold">
                        <Users className="h-3.5 w-3.5 text-slate-400" /> {cab.seatCapacity} Seats
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-semibold">
                        <Briefcase className="h-3.5 w-3.5 text-slate-400" /> {cab.luggageCapacity} Bags
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-amber-500 font-bold">
                        <Wind className="h-3.5 w-3.5" /> AC Included
                      </span>
                    </div>
                  </div>
                </div>

                {/* Center Inclusions & Highlights */}
                <div className="text-xs text-slate-600 space-y-1">
                  <div className="flex items-center gap-1 text-stone-700 font-semibold">
                    <CheckCircle2 className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                    <span>Free cancellation up to 6 hrs prior</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-700 font-medium">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#C25E34] shrink-0" />
                    <span>Includes {estimatedDistance} km allowance</span>
                  </div>
                  <div className="text-slate-500 text-[11px]">
                    Extra km fare: ₹{cab.extraKmRate}/km after {estimatedDistance} km
                  </div>

                  {/* MakeMyTrip Inclusions & Exclusions details link */}
                  <button
                    type="button"
                    onClick={() => setSelectedCabDetails(cab)}
                    className="text-[11px] font-bold text-[#C25E34] hover:underline flex items-center gap-1 pt-1 cursor-pointer"
                  >
                    <Info className="h-3 w-3" />
                    <span>View Inclusions, Exclusions &amp; T&amp;C</span>
                  </button>
                </div>

                {/* Right Pricing & Book Action */}
                <div className="text-left md:text-right shrink-0 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 flex md:flex-col justify-between items-center md:items-end">
                  <div>
                    <div className="flex items-baseline gap-1 md:justify-end">
                      <span className="text-2xl font-black text-slate-900">
                        ₹{calculatedFare.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 block font-medium">
                      toll &amp; state tax payable at booths
                    </span>
                  </div>

                  <button
                    type="button"
                    disabled={isBooking}
                    onClick={() => handleBookCab(cab)}
                    className="mt-3 btn-search-gradient rounded-full px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {isBooking ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        <span>Reserving...</span>
                      </>
                    ) : (
                      <>
                        <span>Book Cab</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* MMT Inclusions & Exclusions Modal */}
      {selectedCabDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-[#C25E34] border border-blue-200 px-2 py-0.5 rounded">
                  {selectedCabDetails.category} PACKAGE
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-1">
                  {selectedCabDetails.name} ({selectedCabDetails.modelExamples})
                </h3>
                <p className="text-xs text-slate-500">Route: {fromCity} &rarr; {toCity} (~{estimatedDistance} km)</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCabDetails(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 cursor-pointer text-slate-500"
              >
                ✕
              </button>
            </div>

            {/* Inclusions vs Exclusions Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-stone-100/70 border border-stone-200 rounded-2xl p-4 space-y-2">
                <h4 className="text-xs font-bold text-stone-800 flex items-center gap-1.5 uppercase tracking-wider">
                  <CheckCircle2 className="h-4 w-4 text-amber-500" />
                  What&apos;s Included
                </h4>
                <ul className="text-xs text-stone-900 space-y-1.5 leading-relaxed font-medium">
                  <li>✓ Base travel allowance of {estimatedDistance} kms</li>
                  <li>✓ Chauffeur charges &amp; night halt allowances</li>
                  <li>✓ Fuel charges for the entire scheduled route</li>
                  <li>✓ Full Air Conditioning across hills &amp; plains</li>
                  <li>✓ 45 minutes delay grace period at pickup</li>
                </ul>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
                <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5 uppercase tracking-wider">
                  <Info className="h-4 w-4 text-[#C25E34]" />
                  What&apos;s Excluded
                </h4>
                <ul className="text-xs text-slate-600 space-y-1.5 leading-relaxed">
                  <li>• Toll tax &amp; FASTag charges (Payable actuals)</li>
                  <li>• State border entry taxes (for interstate trips)</li>
                  <li>• Airport entry / parking tickets if applicable</li>
                  <li>• Extra kms beyond {estimatedDistance} km: ₹{selectedCabDetails.extraKmRate}/km</li>
                  <li>• Extra waiting charges after 45 mins: ₹150/hr</li>
                </ul>
              </div>
            </div>

            {/* Luggage & Cancellation Guidelines */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 text-xs space-y-2">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="font-bold text-slate-900">Luggage Advisory:</span>
                <span className="text-slate-600">
                  {selectedCabDetails.luggageCapacity} large bags (up to 25kg each) + 2 handbags
                </span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="font-bold text-slate-900">Cancellation Policy:</span>
                <span className="font-bold text-amber-500">
                  100% Full Refund up to 6 hours before departure
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedCabDetails(null)}
                className="px-5 py-2.5 rounded-full border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Close Details
              </button>
              <button
                type="button"
                disabled={isBooking}
                onClick={() => {
                  const cab = selectedCabDetails;
                  setSelectedCabDetails(null);
                  handleBookCab(cab);
                }}
                className="btn-search-gradient rounded-full px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md cursor-pointer disabled:opacity-50"
              >
                Proceed to Book Cab
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default function CabListingPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading cabs...</div>}>
      <CabListingContent />
    </Suspense>
  );
}
