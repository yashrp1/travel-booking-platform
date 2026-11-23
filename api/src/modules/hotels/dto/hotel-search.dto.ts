import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsArray } from 'class-validator';

export class HotelSearchDto {
  @ApiPropertyOptional({ example: 'Goa', description: 'City name or destination slug' })
  @IsString()
  @IsOptional()
  destination?: string;

  @ApiPropertyOptional({ example: '2026-11-20', description: 'Check-in date (YYYY-MM-DD)' })
  @IsString()
  @IsOptional()
  checkInDate?: string;

  @ApiPropertyOptional({ example: '2026-11-23', description: 'Check-out date (YYYY-MM-DD)' })
  @IsString()
  @IsOptional()
  checkOutDate?: string;

  @ApiPropertyOptional({ example: 1, default: 1 })
  @IsOptional()
  @IsNumber()
  rooms?: number;

  @ApiPropertyOptional({ example: 2, default: 2 })
  @IsOptional()
  @IsNumber()
  adults?: number;

  @ApiPropertyOptional({ example: [4, 5], description: 'Filter by star rating' })
  @IsOptional()
  @IsArray()
  starRatings?: number[];

  @ApiPropertyOptional({ example: 25000, description: 'Maximum price per night in INR' })
  @IsOptional()
  @IsNumber()
  maxPrice?: number;
}
