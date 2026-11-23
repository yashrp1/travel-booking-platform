import { IsString, IsNotEmpty, IsOptional, IsNumber, IsBoolean } from 'class-validator';

export class CreateVehicleDto {
  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  modelExamples?: string;

  @IsString()
  @IsNotEmpty()
  registrationNumber: string;

  @IsNumber()
  @IsNotEmpty()
  seatCapacity: number;

  @IsNumber()
  @IsOptional()
  luggageCapacity?: number;

  @IsBoolean()
  @IsOptional()
  ac?: boolean;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsNumber()
  @IsNotEmpty()
  baseFarePerKm: number;

  @IsNumber()
  @IsOptional()
  extraKmRate?: number;

  @IsNumber()
  @IsOptional()
  driverAllowance?: number;

  @IsString()
  @IsOptional()
  driverName?: string;

  @IsString()
  @IsOptional()
  driverPhone?: string;

  @IsString()
  @IsOptional()
  operatorId?: string;

  @IsString()
  @IsOptional()
  operatorName?: string;
}
