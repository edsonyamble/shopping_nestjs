import { IsString } from "class-validator";

export class CreateStoreDto {
    @IsString({ message: 'названиме магазина не может быть пустым' })
    title: string
}