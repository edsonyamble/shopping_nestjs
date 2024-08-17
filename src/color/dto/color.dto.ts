import { IsString } from 'class-validator';

export class ColorDto {
  @IsString({ message: 'Должно быть строкой' })
  name: string;

  @IsString({ message: 'Должно быть строкой' })
  value: string;
}
