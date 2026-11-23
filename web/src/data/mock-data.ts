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
  baseFareOneWayPerKm: number;
  extraKmRate: number;
  driverAllowancePerDay: number;
  features: string[];
}

export interface Offer {
  id: string;
  code: string;
  category: 'ALL' | 'HOTEL' | 'CAB' | 'BANK';
  title: string;
  description: string;
  discountBadge: string;
  validTill: string;
  minBooking: number;
}

export const POPULAR_DESTINATIONS: Destination[] = [
  {
    id: 'loc_goa',
    name: 'Goa',
    state: 'Goa',
    country: 'India',
    tag: 'Beach Paradise',
    hotelCount: 1420,
    popularFor: 'Beaches, Nightlife, Shacks & Water Sports',
  },
  {
    id: 'loc_mumbai',
    name: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    tag: 'Financial Capital',
    hotelCount: 980,
    popularFor: 'Marine Drive, Bollywood & Heritage',
  },
  {
    id: 'loc_delhi',
    name: 'New Delhi & NCR',
    state: 'Delhi',
    country: 'India',
    tag: 'National Capital',
    hotelCount: 1850,
    popularFor: 'Monuments, Street Food & Markets',
  },
  {
    id: 'loc_jaipur',
    name: 'Jaipur',
    state: 'Rajasthan',
    country: 'India',
    tag: 'Pink City',
    hotelCount: 740,
    popularFor: 'Palaces, Forts & Royal Stays',
  },
  {
    id: 'loc_bengaluru',
    name: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    tag: 'Silicon Valley',
    hotelCount: 1120,
    popularFor: 'Gardens, Microbreweries & Tech Hubs',
  },
  {
    id: 'loc_udaipur',
    name: 'Udaipur',
    state: 'Rajasthan',
    country: 'India',
    tag: 'City of Lakes',
    hotelCount: 460,
    popularFor: 'Lake Pichola, Luxury Resorts & Romance',
  },
  {
    id: 'loc_manali',
    name: 'Manali',
    state: 'Himachal Pradesh',
    country: 'India',
    tag: 'Himalayan Retreat',
    hotelCount: 620,
    popularFor: 'Snow Mountains, Solang Valley & Adventure',
  },
];

export const FEATURED_HOTELS: Hotel[] = [
  {
    id: 'htl_taj_fort_aguada',
    name: 'Taj Fort Aguada Resort & Spa',
    tagline: '5-Star Luxury Oceanfront Heritage Resort',
    starRating: 5,
    userRating: 4.8,
    ratingWord: 'Excellent',
    reviewCount: 3240,
    city: 'Goa',
    area: 'Sinquerim, Candolim',
    distanceFromBeachOrCenter: 'Direct Beachfront access',
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80',
    imageGallery: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&auto=format&fit=crop&q=80',
    ],
    pricePerNight: 14500,
    originalPrice: 19500,
    taxesAndFees: 2610,
    freeCancellation: true,
    breakfastIncluded: true,
    coupleFriendly: true,
    swimmingPool: true,
    tags: ['MMT Assured', 'Beachfront', 'Infinity Pool', 'Spa'],
    rooms: [
      {
        id: 'room_1',
        name: 'Deluxe Sea Facing Room',
        sqft: 420,
        bed: '1 King Bed',
        maxAdults: 2,
        price: 14500,
        inclusions: ['Free Buffet Breakfast', 'Free High Speed WiFi', 'Complimentary Sunset Cruise'],
      },
      {
        id: 'room_2',
        name: 'Premium Heritage Villa Suite',
        sqft: 750,
        bed: '1 King Bed + Balcony',
        maxAdults: 3,
        price: 24500,
        inclusions: ['Breakfast & Dinner', 'Private Butler Service', 'Airport Pick-up in Luxury Sedan'],
      },
    ],
  },
  {
    id: 'htl_rambagh_palace',
    name: 'Rambagh Palace - Royal Heritage',
    tagline: 'Former Residence of the Maharaja of Jaipur',
    starRating: 5,
    userRating: 4.9,
    ratingWord: 'Superb',
    reviewCount: 2890,
    city: 'Jaipur',
    area: 'Bhawani Singh Road',
    distanceFromBeachOrCenter: '3.5 km from City Palace',
    imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&auto=format&fit=crop&q=80',
    imageGallery: [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&auto=format&fit=crop&q=80',
    ],
    pricePerNight: 32000,
    originalPrice: 42000,
    taxesAndFees: 5760,
    freeCancellation: true,
    breakfastIncluded: true,
    coupleFriendly: true,
    swimmingPool: true,
    tags: ['Royal Palace', 'Luxury Heritage', 'Fine Dining'],
    rooms: [
      {
        id: 'room_rb_1',
        name: 'Palace Room with Courtyard View',
        sqft: 550,
        bed: '1 Grand King Bed',
        maxAdults: 2,
        price: 32000,
        inclusions: ['Royal Breakfast Feast', 'Palace Historical Tour', 'Signature Spa Discount'],
      },
    ],
  },
  {
    id: 'htl_grand_hyatt_mumbai',
    name: 'Grand Hyatt Hotel & Residences',
    tagline: 'Contemporary Urban Oasis in Mumbai',
    starRating: 5,
    userRating: 4.6,
    ratingWord: 'Very Good',
    reviewCount: 4120,
    city: 'Mumbai',
    area: 'Santacruz East / BKC',
    distanceFromBeachOrCenter: '10 min from Domestic Airport',
    imageUrl: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&auto=format&fit=crop&q=80',
    imageGallery: [
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80',
    ],
    pricePerNight: 9800,
    originalPrice: 13500,
    taxesAndFees: 1764,
    freeCancellation: true,
    breakfastIncluded: true,
    coupleFriendly: true,
    swimmingPool: true,
    tags: ['Business Travel', 'Spa', 'Poolside Lounge'],
    rooms: [
      {
        id: 'room_gh_1',
        name: 'Grand King Club Room',
        sqft: 440,
        bed: '1 King Bed',
        maxAdults: 2,
        price: 9800,
        inclusions: ['Club Lounge Access', 'Complimentary Evening Cocktails', 'Free Wi-Fi'],
      },
    ],
  },
  {
    id: 'htl_radisson_blu_goa',
    name: 'Radisson Blu Resort Cavelossim',
    tagline: 'Goan-Portuguese Architecture with Pristine Beach',
    starRating: 4,
    userRating: 4.4,
    ratingWord: 'Very Good',
    reviewCount: 1980,
    city: 'Goa',
    area: 'Cavelossim, South Goa',
    distanceFromBeachOrCenter: '400m from Cavelossim Beach',
    imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&auto=format&fit=crop&q=80',
    imageGallery: [
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&auto=format&fit=crop&q=80',
    ],
    pricePerNight: 6499,
    originalPrice: 9200,
    taxesAndFees: 1170,
    freeCancellation: true,
    breakfastIncluded: true,
    coupleFriendly: true,
    swimmingPool: true,
    tags: ['Family Friendly', 'Kids Club', 'Outdoor Pool'],
    rooms: [
      {
        id: 'room_rad_1',
        name: 'Superior Room Garden View',
        sqft: 380,
        bed: '1 King or Twin Beds',
        maxAdults: 2,
        price: 6499,
        inclusions: ['Breakfast Included', 'Free Swimming Pool Access'],
      },
    ],
  },
];

export const CAB_FLEET: CabPackage[] = [
  {
    id: 'cab_hatchback',
    category: 'HATCHBACK',
    name: 'Wagon R or similar',
    modelExamples: 'Maruti WagonR, Celerio, Tata Tiago',
    seatCapacity: 4,
    luggageCapacity: 2,
    ac: true,
    imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&auto=format&fit=crop&q=80',
    baseFareOneWayPerKm: 11.5,
    extraKmRate: 11.5,
    driverAllowancePerDay: 300,
    features: ['Air Conditioned', 'Clean & Sanitized', 'Top Rated Chauffeur', 'Zero Hidden Fees'],
  },
  {
    id: 'cab_sedan',
    category: 'SEDAN',
    name: 'Dzire, Etios or similar',
    modelExamples: 'Maruti Suzuki Dzire, Toyota Etios, Hyundai Aura',
    seatCapacity: 4,
    luggageCapacity: 3,
    ac: true,
    imageUrl: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=600&auto=format&fit=crop&q=80',
    baseFareOneWayPerKm: 13.0,
    extraKmRate: 13.0,
    driverAllowancePerDay: 300,
    features: ['Spacious Legroom', 'Boot Space for Luggage', 'Highway Certified Driver', 'Free Cancellation up to 6 hrs'],
  },
  {
    id: 'cab_suv',
    category: 'SUV',
    name: 'Ertiga, Carens or similar',
    modelExamples: 'Maruti Suzuki Ertiga, Kia Carens, Renault Triber',
    seatCapacity: 6,
    luggageCapacity: 4,
    ac: true,
    imageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&auto=format&fit=crop&q=80',
    baseFareOneWayPerKm: 17.5,
    extraKmRate: 17.5,
    driverAllowancePerDay: 400,
    features: ['Perfect for Families', 'Rear AC Vents', 'Ample Carrier Space', 'Emergency Roadside Assistance'],
  },
  {
    id: 'cab_premium_suv',
    category: 'PREMIUM_SUV',
    name: 'Innova Crysta',
    modelExamples: 'Toyota Innova Crysta / Hycross',
    seatCapacity: 7,
    luggageCapacity: 5,
    ac: true,
    imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&auto=format&fit=crop&q=80',
    baseFareOneWayPerKm: 22.0,
    extraKmRate: 22.0,
    driverAllowancePerDay: 500,
    features: ['Captain Seats', 'Premium Comfort', 'Experienced Hill/Highway Driver', 'Mineral Water Provided'],
  },
];

export const SPECIAL_OFFERS: Offer[] = [
  {
    id: 'off_welcome',
    code: 'MMTWELCOME',
    category: 'HOTEL',
    title: 'Flat 15% OFF on First Hotel Booking',
    description: 'Use code on luxury resorts & premium stays across India.',
    discountBadge: 'FLAT 15% OFF',
    validTill: '30 Nov 2026',
    minBooking: 3000,
  },
  {
    id: 'off_cab',
    code: 'CABFIRST',
    category: 'CAB',
    title: 'Save up to ₹500 on Outstation Cabs',
    description: 'Valid on One-Way & Round-Trip routes across 2,000+ Indian cities.',
    discountBadge: 'SAVE ₹500',
    validTill: '15 Dec 2026',
    minBooking: 2000,
  },
  {
    id: 'off_hdfc',
    code: 'HDFCTRAVEL',
    category: 'BANK',
    title: 'Instant 10% Discount with HDFC Cards',
    description: 'Applicable on both Hotel and Cab bookings above ₹4,000.',
    discountBadge: 'UP TO ₹2,000',
    validTill: '31 Dec 2026',
    minBooking: 4000,
  },
  {
    id: 'off_weekend',
    code: 'WEEKENDSTAY',
    category: 'HOTEL',
    title: 'Weekend Gateway Special: Flat ₹1,200 OFF',
    description: 'Book Friday to Sunday stays at top leisure destinations.',
    discountBadge: 'FLAT ₹1,200',
    validTill: '28 Nov 2026',
    minBooking: 5000,
  },
];
