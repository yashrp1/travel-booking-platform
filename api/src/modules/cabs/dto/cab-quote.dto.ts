import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';

export enum TripTypeEnum {
  ONE_WAY = 'ONE_WAY',
  ROUND_TRIP = 'ROUND_TRIP',
  RENTAL = 'RENTAL',
  AIRPORT = 'AIRPORT',
}

export class CabQuoteDto {
  @ApiProperty({ enum: TripTypeEnum, default: TripTypeEnum.ONE_WAY })
  @IsEnum(TripTypeEnum)
  tripType: TripTypeEnum;

  @ApiProperty({ example: 'New Delhi', description: 'Pickup city or address' })
  @IsString()
  @IsNotEmpty()
  pickupLocation: string;

  @ApiProperty({ example: 'Agra', description: 'Drop location or rental package' })
  @IsString()
  @IsNotEmpty()
  dropLocation: string;

  @ApiProperty({ example: '2026-11-12', description: 'Scheduled departure date' })
  @IsString()
  @IsNotEmpty()
  departureDate: string;

  @ApiPropertyOptional({ example: '07:00 AM', default: '07:00 AM' })
  @IsOptional()
  @IsString()
  pickupTime?: string;
}
