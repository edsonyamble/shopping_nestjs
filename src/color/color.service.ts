import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ColorDto } from './dto/color.dto';

@Injectable()
export class ColorService {
  constructor(private readonly prisma: PrismaService) {}

  //получение цвета для конкретно магазина по id
  async getByStoreId(storeId: string) {
    return this.prisma.color.findMany({
      where: {
        storeId,
      },
    });
  }

  //получение цвета по id
  async getById(id: string) {
    const color = await this.prisma.color.findUnique({
      where: {
        id,
      },
    });
    if (!color) throw new NotFoundException('цвет не найден');
    return color;
  }

  //создание цвета
  async create(storeId: string, dto: ColorDto) {
    return this.prisma.color.create({
      data: {
        name: dto.name,
        value: dto.value,
        storeId,
      },
    });
  }
  //Обновление цвет
  async update(id: string, dto: ColorDto) {
    await this.getById(id);
    return this.prisma.color.update({
      where: {
        id: id,
      },
      data: {
        name: dto.name,
        value: dto.value,
      },
    });
  }

  //удаление цвет
  async delete(id: string) {
    await this.getById(id);
    return this.prisma.color.delete({
      where: {
        id: id,
      },
    });
  }
}
