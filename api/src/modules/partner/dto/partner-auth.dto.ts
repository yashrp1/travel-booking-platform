import { IsArray, IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterPartnerDto {
  @IsString()
  @IsNotEmpty()
  businessName: string;

  @IsString()
  @IsNotEmpty()
  contactName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;

  @IsArray()
  @IsNotEmpty()
  services: ('HOTELS' | 'CABS')[];
}

export class LoginPartnerDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class UpdatePartnerServicesDto {
  @IsArray()
  @IsNotEmpty()
  services: ('HOTELS' | 'CABS')[];
}
