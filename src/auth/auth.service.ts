import { Response } from 'express';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/user/user.service';
import { AuthDto } from './dto/auth.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  EXPIRE_DAY_REFRESH_TOKEN = 1;
  REFRESH_TOKEN_NAME = 'refreshToken';

  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}
//логин
  async login(dto: AuthDto) {
    const user = await this.validateUser(dto);
    const tokens = this.issueTokens(user.id);
    return { user, ...tokens };
  }
//регистрация
  async register(dto: AuthDto) {
    const olduser = await this.userService.getByEmail(dto.email);
    if (olduser) throw new BadRequestException('пользователь существует');
    const user = await this.userService.create(dto);
    const tokens = this.issueTokens(user.id);
    return { user, ...tokens };
  }

  //получить новый токен
  async getNewtokens(refreshToken: string) {
    const result = await this.jwtService.verifyAsync(refreshToken);
    if (!result) throw new UnauthorizedException('неверный токен');
    const user = await this.userService.getById(result.id);
    const tokens = this.issueTokens(user.id);
    return { user, ...tokens };
  }
//генерация токенов
  issueTokens(userId: string) {
    const data = { id: userId };
    const accessToken = this.jwtService.sign(data, { expiresIn: '1h' });
    const refreshToken = this.jwtService.sign(data, { expiresIn: '7d' });
    return { accessToken, refreshToken };
  }
//валидация юзера проверка по email
  private async validateUser(dto: AuthDto) {
    const user = await this.userService.getByEmail(dto.email);
    if (!user) throw new NotFoundException('пользователь не найден');
    return user;
  }
  //валидация OAuth yandex google
  async validateOAuthLogin(req: any) {
    let user = await this.userService.getByEmail(req.user.email);
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: req.user.email,
          name: req.user.name,
          picture: req.user.picture,
        },
        include: { stores: true, favorites: true, orders: true },
      });
    }
    const tokens = this.issueTokens(user.id);
    return { user, ...tokens };
  }
//добавление токена в куки
  addREfreshTokenToResponse(res: Response, refreshToken: string) {
    const expireIn = new Date();
    expireIn.setDate(expireIn.getDate() + this.EXPIRE_DAY_REFRESH_TOKEN);
    res.cookie(this.REFRESH_TOKEN_NAME, refreshToken, {
      domain: this.configService.get('SERVER_DOMAIN'),
      httpOnly: true,
      expires: expireIn,
      secure: true,
      sameSite: 'none',
    });
  }
//удаление токена из куки
  removeREfreshTokenTFromResponse(res: Response) {
    res.cookie(this.REFRESH_TOKEN_NAME, {
      domain: this.configService.get('SERVER_DOMAIN'),
      httpOnly: true,
      expires: new Date(0),
      secure: true,
      sameSite: 'none',
    });
  }
}
