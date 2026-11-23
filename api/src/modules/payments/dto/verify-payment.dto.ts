import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class VerifyPaymentDto {
  @ApiProperty({ example: 'MMT-HTL-202611-9872' })
  @IsString()
  @IsNotEmpty()
  bookingReference: string;

  @ApiProperty({ example: 'order_rzp_9812498' })
  @IsString()
  @IsNotEmpty()
  razorpayOrderId: string;

  @ApiProperty({ example: 'pay_rzp_981249812' })
  @IsString()
  @IsNotEmpty()
  razorpayPaymentId: string;

  @ApiProperty({ example: 'a8b7c6...sha256' })
  @IsString()
  @IsNotEmpty()
  razorpaySignature: string;
}
