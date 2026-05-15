import { IsString, MinLength, Matches } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  currentPassword: string;

  @IsString()
  @MinLength(8, { message: 'Пароль должен быть более 8 символов' })
  @Matches(/[A-Z]/, {
    message: 'Пароль должен сожержать хотя бы одну заглавную букву',
  })
  @Matches(/[a-z]/, {
    message: 'Пароль должен сожержать хотя бы одну букву',
  })
  @Matches(/\d/, { message: 'Пароль должен сожержать хотя бы одну цифру' })
  @Matches(/[!@#$%^&*(),.:"{}|<>]/g, {
    message: 'Пароль должен сожержвать хотя бы один спецсимвол',
  })
  newPassword: string;
}
