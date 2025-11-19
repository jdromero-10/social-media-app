import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class ValidateFieldDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(['email', 'username'], {
    message: 'El campo debe ser "email" o "username"',
  })
  field: 'email' | 'username';

  @IsString()
  @IsNotEmpty()
  value: string;
}
