import { Controller, Get, Param, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from './decorator/user.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}


  // получение профиля
  @Auth()
  @Get('profile')
  async getProfile(@CurrentUser('id') id:string) {
    return this.userService.getById(id);
  }
//добавление в избраное
  @Auth()
  @Patch('profile/favorite/:productId')
  async toogleFavorite(@CurrentUser('id') id:string,@Param('productId') productId:string) {
    return this.userService.toogleFavorite(id,productId);
  }

}
