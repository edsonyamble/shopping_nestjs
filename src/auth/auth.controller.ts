import {
  Body,
  Controller,
  HttpCode,
  Post,
  UsePipes,
  Res,
  ValidationPipe,
  Req,
  Get,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Request, Response, response } from 'express';
import { PassThrough } from 'stream';
import { AuthGuard } from '@nestjs/passport';
import { Profile } from 'passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('login')
  async login(@Body() dto: AuthDto, @Res({ passthrough: true }) res: Response) {
    const { refreshToken, ...response } = await this.authService.login(dto);
    this.authService.addREfreshTokenToResponse(res, refreshToken);
    return response;
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('register')
  async register(
    @Body() dto: AuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { refreshToken, ...response } = await this.authService.register(dto);
    this.authService.addREfreshTokenToResponse(res, refreshToken);
    return response;
  }

//mеthod для получение новы токенов
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('login/access-token')
  async getNewsTokens(
    @Body() dto: AuthDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
   const refreshTokenFromCookies = req.cookies[this.authService.REFRESH_TOKEN_NAME];
   if(!refreshTokenFromCookies){
    this.authService.removeREfreshTokenTFromResponse(res);
    throw new UnauthorizedException('неверный токен');
   }
   const { refreshToken, ...response } = await this.authService.getNewtokens(refreshTokenFromCookies);
    this.authService.addREfreshTokenToResponse(res, refreshToken);
    return response;
  }
  //method logout 
  @HttpCode(200)
  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    this.authService.removeREfreshTokenTFromResponse(res);
    return {
      message: 'вы вышли из аккаунта',
    };
  }

//mthod login google and yandex

@Get('google')
@UseGuards(AuthGuard('google'))
async googleAuth(@Req() _req) {}

@Get('google/callback')
@UseGuards(AuthGuard('google'))
async googleAuthCallback(@Req() req:any, @Res({ passthrough: true }) res: Response) {
  const { refreshToken, ...response } = await this.authService.validateOAuthLogin(req);
  this.authService.addREfreshTokenToResponse(res, refreshToken);
  return res.redirect(`${process.env['CLIENT_URL']}/dashboard?accessToken=${response.accessToken}`);//когда ползовател будет переадпесовать будет сохранит токен в куки
}


  @Get('yandex')
  @UseGuards(AuthGuard('yandex'))
  async yandexAuth(@Req() _req) { }

  @Get('yandex/callback')
  @UseGuards(AuthGuard('yandex'))
  async yandexAuthCallback(@Req() req: any, @Res({ passthrough: true }) res: Response) {
    const { refreshToken, ...response } = await this.authService.validateOAuthLogin(req);
    this.authService.addREfreshTokenToResponse(res, refreshToken);
    return res.redirect(`${process.env['CLIENT_URL']}/dashboard?accessToken=${response.accessToken}`);//когда ползовател будет переадпесовать будет сохранит токен в куки
  }


}
