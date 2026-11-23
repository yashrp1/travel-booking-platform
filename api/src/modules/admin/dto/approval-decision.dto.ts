import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ApprovalDecisionDto {
  @IsEnum(['PROPERTY', 'VEHICLE'])
  @IsNotEmpty()
  type: 'PROPERTY' | 'VEHICLE';

  @IsString()
  @IsNotEmpty()
  id: string;

  @IsEnum(['APPROVE', 'REJECT'])
  @IsNotEmpty()
  decision: 'APPROVE' | 'REJECT';

  @IsString()
  @IsOptional()
  notes?: string;
}
