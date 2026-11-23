import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsArray, Min, Max } from 'class-validator';

export class SubmitReviewDto {
  @ApiProperty({ example: 'htl-del-01' })
  @IsString()
  hotelId: string;

  @ApiProperty({ example: 'MMT-HTL-202611-9872' })
  @IsString()
  bookingReference: string;

  @ApiProperty({ example: 'Aman Mathur' })
  @IsString()
  authorName: string;

  @ApiProperty({ example: 5, minimum: 1, maximum: 5 })
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({ example: 'Exceptional hospitality and royal stay!' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'The palace architecture, attentive service, and beach view made our anniversary trip unforgettable.' })
  @IsString()
  comment: string;

  @ApiProperty({ example: 'Couple', enum: ['Solo', 'Couple', 'Family', 'Friends', 'Business'] })
  @IsString()
  travellerType: string;

  @ApiPropertyOptional({ example: 5 })
  @IsOptional()
  @IsNumber()
  cleanlinessRating?: number;

  @ApiPropertyOptional({ example: 4.8 })
  @IsOptional()
  @IsNumber()
  serviceRating?: number;

  @ApiPropertyOptional({ example: 5 })
  @IsOptional()
  @IsNumber()
  locationRating?: number;

  @ApiPropertyOptional({ example: ['https://images.unsplash.com/photo-1566073771259-6a8506099945'] })
  @IsOptional()
  @IsArray()
  photos?: string[];
}
