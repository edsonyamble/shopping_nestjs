import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CategoryDto } from './dto/category.dto';

@Injectable()
export class CategoryService {
    constructor(private readonly prisma: PrismaService) { }

    //получение  для конкретно магазина по id
    async getByStoreId(storeId: string) {
        return this.prisma.category.findMany({
            where: {
                storeId,
            },
        });
    }

    //получение  по id
    async getById(id: string) {
        const category = await this.prisma.category.findUnique({
            where: {
                id,
            },
        });
        if (!category) throw new NotFoundException('category не найден');
        return category;
    }

    //создание category
    async create(storeId: string, dto: CategoryDto) {
        return this.prisma.category.create({
            data: {
                title: dto.title,
                description: dto.description,
                storeId,
            },
        });
    }
    //Обновление category
    async update(id: string, dto: CategoryDto) {
        await this.getById(id);
        return this.prisma.category.update({
            where: {
                id: id,
            },
            data: {
                title: dto.title,
                description: dto.description,
            },
        });
    }

    //удаление category
    async delete(id: string) {
        await this.getById(id);
        return this.prisma.color.delete({
            where: {
                id: id,
            },
        });
    }
}
