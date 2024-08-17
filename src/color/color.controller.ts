import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ColorService } from './color.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ColorDto } from './dto/color.dto';

@Controller('colors')
export class ColorController {
  constructor(private readonly colorService: ColorService) {}
  //получение цвета по магазину по id
  @Auth()
  @Get('by-storeId/:storeId')
  async getByStoreId(@Param('storeId') storeId: string) {
    return this.colorService.getByStoreId(storeId);
  }
  //получение цвета  по id
  @Auth()
  @Get('by-id/:id')
  async getById(@Param('id') id: string) {
    return this.colorService.getById(id);
  }
  //создание цвета
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Post(':storeId')
  async create(@Param('storeId') storeId: string, @Body() dto: ColorDto) {
    return this.colorService.create(storeId, dto);
  }

  //Обновление Цвета
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: ColorDto) {
    return this.colorService.update(id, dto);
  }

  //удаление магазина
  @HttpCode(200)
  @Auth()
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.colorService.delete(id);
  }
}
