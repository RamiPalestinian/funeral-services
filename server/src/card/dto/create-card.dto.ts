import { IsInt, IsOptional, Min } from 'class-validator';

export class CreateCardDto {
  @IsInt()
  userId: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  serviceId?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  islamicId?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  classicServiceId?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  cremationId?: number;
}
