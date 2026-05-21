import { IsIn, IsOptional } from 'class-validator';

export class CheckoutDto {
  @IsOptional()
  @IsIn(['card', 'sbp', 'cash'])
  paymentMethod?: 'card' | 'sbp' | 'cash';
}
