import { IsEmail,IsOptional,IsString,MinLength } from "class-validator";

export class AuthDto {
  @IsOptional()
  @IsString()
  name: string;

 @IsString({message: 'почта обязательно для заполнения'})
  @IsEmail()
  email: string;

  @IsString({message: 'пароль обязательно для заполнения'})
  @MinLength(6, {message: 'пароль должен быть больше 6 символов'})
  password: string;
}