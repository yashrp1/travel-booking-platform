import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';

export class VerifyCouponDto {
  @ApiProperty({ example: 'MMTWELCOME' })
  @IsString()
  code: string;

  @ApiProperty({ example: 12500 })
  @IsNumber()
  orderAmount: number;

  @ApiProperty({ example: 'HOTEL', enum: ['HOTEL', 'CAB'] })
  @IsString()
  category: string;
}
