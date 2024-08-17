import { IsString } from 'class-validator';

export class CategoryDto {
  @IsString({ message: 'название обязательно title' })
  title: string;

  @IsString({ message: 'описание обязательно description' })
  description: string;
}
