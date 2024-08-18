import {
  Body,
  Controller,
  HttpCode,
  Post,
  UsePipes,
  ValidationPipe
} from '@nestjs/common'
import { Auth } from 'src/auth/decorators/auth.decorator'

import { OrderDto } from './dto/order.dto'
import { PaymentStatusDto } from './dto/payment-status.dto'
import { OrderService } from './order.service'
import { CurrentUser } from 'src/user/decorator/user.decorator'

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) { }
//создание платежа
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('place')
  @Auth()
  async checkout(@Body() dto: OrderDto, @CurrentUser('id') userId: string) {
    return this.orderService.createPayment(dto, userId)
  }
//изменение статуса
  @HttpCode(200)
  @Post('status')
  async updateStatus(@Body() dto: PaymentStatusDto) {
    return this.orderService.updateStatus(dto)
  }
}
