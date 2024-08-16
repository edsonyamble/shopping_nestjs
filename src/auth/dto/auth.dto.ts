import { IsEmail,IsOptional,IsString,MinLength } from "class-validator";

export class AuthDto {
  @IsOptional()//поле не обязательно
  @IsString()//поле должно быть строкой
  name: string;

 @IsString({message: 'почта обязательно для заполнения'})//поле должно быть строкой
  @IsEmail()//поле должно быть почтой
  email: string;

  @IsString({message: 'пароль обязательно для заполнения'})
  @MinLength(6, {message: 'пароль должен быть больше 6 символов'})//поле должно быть строкой и должно быть больше 6 символов
  password: string;
}