import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { AuthDto } from '../auth/dto/auth.dto';
import { hash } from 'argon2';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) { }

  //получение юзер по id
  async getById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      include: { stores: true, favorite: true, order: true },
    });
    return user;
  }
//получение юзера по email
  async getByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
      include: { stores: true, favorite: true, order: true },
    });
    return user
  }
//создание юзера
  async create(dto: AuthDto) {
    return this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: await hash(dto.password),
      }
    })
  }
}
