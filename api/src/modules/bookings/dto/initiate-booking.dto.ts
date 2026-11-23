import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsEmail, IsOptional, IsBoolean, IsArray } from 'class-validator';

export class InitiateHotelBookingDto {
  @ApiProperty({ example: 'htl_taj_fort_aguada' })
  @IsString()
  @IsNotEmpty()
  hotelId: string;

  @ApiProperty({ example: 'room_deluxe_sea' })
  @IsString()
  @IsNotEmpty()
  roomTypeId: string;

  @ApiProperty({ example: '2026-11-15' })
  @IsString()
  @IsNotEmpty()
  checkInDate: string;

  @ApiProperty({ example: '2026-11-18' })
  @IsString()
  @IsNotEmpty()
  checkOutDate: string;

  @ApiProperty({ example: 14500 })
  @IsNumber()
  baseAmount: number;

  @ApiProperty({ example: 'Rahul Sharma' })
  @IsString()
  @IsNotEmpty()
  guestName: string;

  @ApiProperty({ example: 'rahul.sharma@example.com' })
  @IsEmail()
  guestEmail: string;

  @ApiProperty({ example: '+919876543210' })
  @IsString()
  @IsNotEmpty()
  guestPhone: string;

  @ApiPropertyOptional({ example: 'MMTWELCOME' })
  @IsOptional()
  @IsString()
  couponCode?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  zeroCancellationInsurance?: boolean;

  @ApiPropertyOptional({ example: ['Non-Smoking Room', 'High Floor'] })
  @IsOptional()
  @IsArray()
  specialRequests?: string[];

  @ApiPropertyOptional({ example: { companyName: 'Acme Corp', gstin: '29AAAAA0000A1Z5' } })
  @IsOptional()
  gstinDetails?: {
    companyName: string;
    gstin: string;
    companyAddress?: string;
  };

  @ApiPropertyOptional({ example: 500 })
  @IsOptional()
  @IsNumber()
  walletCoinsRedeemed?: number;
}
