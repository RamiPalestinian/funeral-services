import {
  IsString,
  IsNumber,
  IsUrl,
  MinLength,
  Min,
  IsOptional,
} from 'class-validator';

export class UpdateCremationDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  name?: string;

  @IsOptional()
  @IsString()
  @MinLength(10)
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsString()
  @IsUrl()
  image?: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  category?: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  status?: string;
}
