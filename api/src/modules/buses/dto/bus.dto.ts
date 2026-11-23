import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsArray, IsNotEmpty } from 'class-validator';

export class BusSearchDto {
  @ApiPropertyOptional({ example: 'New Delhi' })
  @IsString()
  @IsOptional()
  fromCity?: string;

  @ApiPropertyOptional({ example: 'Manali' })
  @IsString()
  @IsOptional()
  toCity?: string;

  @ApiPropertyOptional({ example: '2026-11-25' })
  @IsString()
  @IsOptional()
  travelDate?: string;

  @ApiPropertyOptional({ example: 'AC Sleeper' })
  @IsString()
  @IsOptional()
  busType?: string;

  @ApiPropertyOptional({ example: 2500 })
  @IsNumber()
  @IsOptional()
  maxFare?: number;
}

export class CreateBusDto {
  @ApiProperty({ example: 'Zingbus Plus' })
  @IsString()
  @IsNotEmpty()
  operatorName: string;

  @ApiProperty({ example: 'BharatBenz AC Sleeper (2+1)' })
  @IsString()
  @IsNotEmpty()
  busType: string;

  @ApiProperty({ example: 'New Delhi' })
  @IsString()
  @IsNotEmpty()
  fromCity: string;

  @ApiProperty({ example: 'Manali' })
  @IsString()
  @IsNotEmpty()
  toCity: string;

  @ApiProperty({ example: '08:30 PM' })
  @IsString()
  @IsNotEmpty()
  departureTime: string;

  @ApiProperty({ example: '07:30 AM' })
  @IsString()
  @IsNotEmpty()
  arrivalTime: string;

  @ApiProperty({ example: '11h 00m' })
  @IsString()
  @IsNotEmpty()
  duration: string;

  @ApiProperty({ example: 1250 })
  @IsNumber()
  @IsNotEmpty()
  fare: number;

  @ApiPropertyOptional({ example: 4.8 })
  @IsOptional()
  @IsNumber()
  rating?: number;

  @ApiPropertyOptional({ example: 36 })
  @IsOptional()
  @IsNumber()
  totalSeats?: number;

  @ApiPropertyOptional({ example: 18 })
  @IsOptional()
  @IsNumber()
  availableSeats?: number;

  @ApiPropertyOptional({ example: ['Live Tracking', 'Charging Point', 'Blanket', 'WiFi'] })
  @IsOptional()
  @IsArray()
  amenities?: string[];

  @ApiPropertyOptional({ example: ['Kashmere Gate ISBT', 'Majnu Ka Tilla'] })
  @IsOptional()
  @IsArray()
  boardingPoints?: string[];

  @ApiPropertyOptional({ example: ['Private Bus Stand Manali', 'Mall Road'] })
  @IsOptional()
  @IsArray()
  droppingPoints?: string[];

  @ApiPropertyOptional({ example: 'HR 38 AA 9021' })
  @IsOptional()
  @IsString()
  registrationNumber?: string;
}
