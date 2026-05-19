import { IsString, MinLength } from 'class-validator';

export class IndexFileDto {
  @IsString()
  @MinLength(1)
  filePath: string;
}
