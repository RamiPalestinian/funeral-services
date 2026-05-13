import { IsString, IsNumber, IsUrl, MinLength, IsInt, Min } from 'class-validator';

export class CreateCremationDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsString()
  @MinLength(10)
  description: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsString()
  @IsUrl()
  image: string;

  @IsString()
  @MinLength(3)
  category: string;

  @IsString()
  @MinLength(3)
  status: string;

  @IsInt()
  userId: number;
}
