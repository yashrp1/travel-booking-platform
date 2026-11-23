import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class InitiateCabBookingDto {
  @ApiProperty({ example: 'sedan' })
  @IsString()
  cabCategoryId: string;

  @ApiProperty({ example: 'ONE_WAY', enum: ['ONE_WAY', 'ROUND_TRIP', 'AIRPORT', 'HOURLY'] })
  @IsString()
  tripType: string;

  @ApiProperty({ example: 'New Delhi' })
  @IsString()
  sourceCity: string;

  @ApiPropertyOptional({ example: 'Agra' })
  @IsOptional()
  @IsString()
  destinationCity?: string;

  @ApiProperty({ example: '2026-11-15' })
  @IsString()
  pickupDate: string;

  @ApiProperty({ example: '07:30 AM' })
  @IsString()
  pickupTime: string;

  @ApiProperty({ example: 'Rohit Verma' })
  @IsString()
  passengerName: string;

  @ApiProperty({ example: '+91 98765 43210' })
  @IsString()
  passengerPhone: string;

  @ApiProperty({ example: 'rohit.verma@example.com' })
  @IsString()
  passengerEmail: string;

  @ApiProperty({ example: 'Terminal 3, IGI Airport' })
  @IsString()
  pickupAddress: string;

  @ApiPropertyOptional({ example: 'Taj East Gate Road, Agra' })
  @IsOptional()
  @IsString()
  dropAddress?: string;

  @ApiProperty({ example: 3420 })
  @IsNumber()
  baseFare: number;

  @ApiProperty({ example: 450 })
  @IsNumber()
  tollTaxes: number;

  @ApiPropertyOptional({ example: 'CABRUSH' })
  @IsOptional()
  @IsString()
  couponCode?: string;
}
