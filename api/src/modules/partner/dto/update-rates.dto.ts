import { IsString, IsOptional, IsNumber } from 'class-validator';

export class UpdateRatesDto {
  @IsString()
  @IsOptional()
  roomTypeId?: string;

  @IsNumber()
  @IsOptional()
  newPrice?: number;

  @IsNumber()
  @IsOptional()
  availableRooms?: number;
}
