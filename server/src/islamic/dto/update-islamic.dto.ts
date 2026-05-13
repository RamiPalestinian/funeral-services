import {
  IsUrl,
  IsString,
  IsNumber,
  MinLength,
  Min,
  IsOptional,
} from 'class-validator';

export class UpdateIslamicDto {
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
