import { Body, Controller, Get, HttpCode, Post, Req, Ip, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { LoginDTO, RegisterDTO } from './dtos';
import { JwtAuthGuard } from './guards';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('login')
  @HttpCode(200)
  async login(@Req() req: Request, @Body() body: LoginDTO, @Ip() ip) {
    return this.appService.login(req, body, ip);
  }

  @Post('register')
  @HttpCode(201)
  async register(@Req() req: Request, @Body() body: RegisterDTO, @Ip() ip) {
    return this.appService.register(req, body, ip);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  async getAuthenticatedUser(@Req() req: Request) {
    return this.appService.getAuthUser(req);
  }
}
