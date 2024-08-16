import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export const getJwtConfig = async (
  configService: ConfigService,
): Promise<JwtModuleOptions> => ({
  secret: configService.get('JWT_SECRET'),
});
//это асинхрон функция которая возвращает промис который возвращает объект с настройками для jwt и чрез secret мы забираем через configservice  JWT_SECRET собираем из env file 