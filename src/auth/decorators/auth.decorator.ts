import { UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
//авторизация можно любой ползователь даже не авторизованы но в профайл только авторизованный
export const Auth = () => UseGuards(JwtAuthGuard)
