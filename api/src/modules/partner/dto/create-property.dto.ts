import { IsString, IsNotEmpty, IsOptional, IsNumber, IsArray, IsBoolean } from 'class-validator';

export class CreatePropertyDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  propertyType: 'HOTEL' | 'RESORT' | 'HOMESTAY' | 'VILLA';

  @IsNumber()
  @IsNotEmpty()
  starRating: number;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsOptional()
  area?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  distanceFromBeach?: string;

  @IsString()
  @IsOptional()
  thumbnailUrl?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsArray()
  @IsOptional()
  images?: string[];

  @IsNumber()
  @IsOptional()
  pricePerNight?: number;

  @IsNumber()
  @IsOptional()
  basePrice?: number;

  @IsNumber()
  @IsOptional()
  discountedPrice?: number;

  @IsNumber()
  @IsOptional()
  originalPrice?: number;

  @IsBoolean()
  @IsOptional()
  freeCancellation?: boolean;

  @IsBoolean()
  @IsOptional()
  breakfastIncluded?: boolean;

  @IsArray()
  @IsOptional()
  amenities?: string[];

  @IsArray()
  @IsOptional()
  rooms?: any[];

  @IsString()
  @IsOptional()
  partnerId?: string;

  @IsString()
  @IsOptional()
  partnerName?: string;

  @IsString()
  @IsOptional()
  partnerEmail?: string;
}
