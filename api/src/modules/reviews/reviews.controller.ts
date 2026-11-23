import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { SubmitReviewDto } from './dto/submit-review.dto';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get('hotel/:hotelId')
  @ApiOperation({ summary: 'Get verified traveller reviews for a hotel property' })
  getHotelReviews(@Param('hotelId') hotelId: string) {
    return this.reviewsService.getReviewsByHotelId(hotelId);
  }

  @Post('submit')
  @ApiOperation({ summary: 'Submit a verified guest review with ratings and comments' })
  submitReview(@Body() dto: SubmitReviewDto) {
    return this.reviewsService.submitReview(dto);
  }
}
