export interface Destination {
  id: string;
  name: string;
  state: string;
  country: string;
  tag: string;
  hotelCount: number;
  popularFor: string;
}

export interface Hotel {
  id: string;
  name: string;
  tagline: string;
  starRating: number;
  userRating: number;
  ratingWord: string;
  reviewCount: number;
  city: string;
  area: string;
  distanceFromBeachOrCenter: string;
  imageUrl: string;
  imageGallery: string[];
  pricePerNight: number;
  originalPrice: number;
  taxesAndFees: number;
  freeCancellation: boolean;
  breakfastIncluded: boolean;
  coupleFriendly: boolean;
  swimmingPool: boolean;
  tags: string[];
  rooms: {
    id: string;
    name: string;
    sqft: number;
    bed: string;
    maxAdults: number;
    price: number;
    inclusions: string[];
  }[];
}

export interface CabPackage {
  id: string;
  category: 'HATCHBACK' | 'SEDAN' | 'SUV' | 'PREMIUM_SUV';
  name: string;
  modelExamples: string;
  seatCapacity: number;
  luggageCapacity: number;
  ac: boolean;
  imageUrl: string;
  baseFarePerKm: number;
  extraKmRate: number;
  driverAllowance: number;
  freeCancellationHours: number;
}

export interface Offer {
  id: string;
  code: string;
  title: string;
  description: string;
  discountType: 'FLAT' | 'PERCENTAGE';
  discountValue: number;
  category: 'HOTEL' | 'CAB' | 'ALL';
  validTill: string;
}

// Zero hardcoded mock records — all inventory is queried dynamically from PostgreSQL
export const POPULAR_DESTINATIONS: Destination[] = [];
export const FEATURED_HOTELS: Hotel[] = [];
export const CAB_FLEET: CabPackage[] = [];
export const SPECIAL_OFFERS: Offer[] = [];
