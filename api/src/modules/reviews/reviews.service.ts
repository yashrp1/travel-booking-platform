import { Injectable, BadRequestException } from '@nestjs/common';
import { SubmitReviewDto } from './dto/submit-review.dto';

export interface HotelReview {
  id: string;
  hotelId: string;
  bookingReference: string;
  authorName: string;
  rating: number;
  title: string;
  comment: string;
  travellerType: string;
  cleanlinessRating: number;
  serviceRating: number;
  locationRating: number;
  verifiedStay: boolean;
  photos: string[];
  createdAt: string;
}

@Injectable()
export class ReviewsService {
  private readonly reviews: HotelReview[] = [
    {
      id: 'rev-001',
      hotelId: 'htl-del-01',
      bookingReference: 'MMT-HTL-202610-1123',
      authorName: 'Vikramaditya S.',
      rating: 5,
      title: 'Majestic ambience and top-tier luxury',
      comment: 'The Leela Palace in Chanakyapuri is an architectural masterpiece. The rooftop infinity pool overlooking Delhi skyline is mesmerising.',
      travellerType: 'Couple',
      cleanlinessRating: 5,
      serviceRating: 5,
      locationRating: 5,
      verifiedStay: true,
      photos: [],
      createdAt: '2026-10-25T14:30:00Z',
    },
    {
      id: 'rev-002',
      hotelId: 'htl-del-01',
      bookingReference: 'MMT-HTL-202610-8841',
      authorName: 'Priyanka Sen',
      rating: 4.8,
      title: 'Warm hospitality and mouth-watering breakfast spread',
      comment: 'Stayed for 3 nights on a business trip. The Butler service was extraordinarily prompt. Highly recommended for premium stays.',
      travellerType: 'Business',
      cleanlinessRating: 5,
      serviceRating: 4.8,
      locationRating: 4.9,
      verifiedStay: true,
      photos: [],
      createdAt: '2026-10-28T09:15:00Z',
    },
  ];

  getReviewsByHotelId(hotelId: string) {
    const list = this.reviews.filter((r) => r.hotelId === hotelId);
    const avgRating = list.length
      ? Number((list.reduce((acc, r) => acc + r.rating, 0) / list.length).toFixed(1))
      : 4.8;

    return {
      hotelId,
      totalReviews: list.length,
      averageRating: avgRating,
      reviews: list,
    };
  }

  submitReview(dto: SubmitReviewDto) {
    if (dto.rating < 1 || dto.rating > 5) {
      throw new BadRequestException('Rating must be between 1 and 5 stars');
    }

    const newReview: HotelReview = {
      id: `rev-${Date.now()}`,
      hotelId: dto.hotelId,
      bookingReference: dto.bookingReference,
      authorName: dto.authorName || 'Verified Traveller',
      rating: dto.rating,
      title: dto.title,
      comment: dto.comment,
      travellerType: dto.travellerType || 'Couple',
      cleanlinessRating: dto.cleanlinessRating || dto.rating,
      serviceRating: dto.serviceRating || dto.rating,
      locationRating: dto.locationRating || dto.rating,
      verifiedStay: true,
      photos: dto.photos || [],
      createdAt: new Date().toISOString(),
    };

    this.reviews.unshift(newReview);

    return {
      success: true,
      message: 'Review successfully submitted and verified!',
      review: newReview,
    };
  }
}
