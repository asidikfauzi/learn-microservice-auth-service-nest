import { Body, Controller, Get, HttpCode, Post, Req, Ip } from '@nestjs/common';
import { AppService } from './app.service';
import { LoginDTO, RegisterDTO } from './dtos';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  @HttpCode(200)
  async login(@Req() req: Request, @Body() body: LoginDTO) {
    return this.appService.login(req, body)
  }

  @Post('register')
  @HttpCode(201)
  async register(@Req() req: Request, @Body() body: RegisterDTO, @Ip() ip) {
    return this.appService.register(req, body, ip)
  }
}
