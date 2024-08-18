import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe
} from '@nestjs/common'
import { Auth } from 'src/auth/decorators/auth.decorator'

import { ProductDto } from './dto/product.dto'
import { ProductService } from './product.service'

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) { }
//поиск по всем данным
  @Get()
  async getAll(@Query('searchTerm') searchTerm?: string) {
    return this.productService.getAll(searchTerm)
  }
//поиск по магазину
  @Auth()
  @Get('by-storeId/:storeId')
  async getByStoreId(@Param('storeId') storeId: string) {
    return this.productService.getByStoreId(storeId)
  }
//поиск по id
  @Get('by-id/:id')
  async getById(@Param('id') id: string) {
    return this.productService.getById(id)
  }
//поиск по категории
  @Get('by-category/:categoryId')
  async getbyCategory(@Param('categoryId') categoryId: string) {
    return this.productService.getByCategory(categoryId)
  }
//поиск по самым популярным
  @Get('most-popular')
  async getMostPopular() {
    return this.productService.getMostPopular()
  }
//поиск похожих
  @Get('similar/:id')
  async getSimilar(@Param('id') id: string) {
    return this.productService.getSimilar(id)
  }
//создание продукта
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Post(':storeId')
  async create(@Param('storeId') storeId: string, @Body() dto: ProductDto) {
    return this.productService.create(storeId, dto)
  }
//изменение продукта
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: ProductDto) {
    return this.productService.update(id, dto)
  }
//удаление продукта
  @HttpCode(200)
  @Auth()
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.productService.delete(id)
  }
}
