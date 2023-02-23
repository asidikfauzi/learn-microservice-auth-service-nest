import { Body, Controller, Get, HttpCode, Post, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { LoginDTO } from './dtos/login.dto';
import { RegisterDTO } from './dtos/register.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  @HttpCode(200)
  async login(@Req() req: Request, @Body() body: LoginDTO) {

  }

  @Post('register')
  @HttpCode(201)
  async register(@Req() req: Request, @Body() body: RegisterDTO) {

  }
}
