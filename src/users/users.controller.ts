import {
  Controller,
  Get,
  Post,
  Request,
  Body,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from './auth.guard';
import { Request as RequestType } from 'express';
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(AuthGuard)
  @Get()
  getUsers(@Request() req: RequestType & { user: { type: string } }) {
    return this.usersService.getUsers(req.user.type);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getUser(@Request() req: RequestType & { user: { username: string } }) {
    return this.usersService.getUser(req.user.username);
  }

  @Post('signin')
  signinUser(@Body() body: { username: string; password: string }) {
    return this.usersService.signinUser(body);
  }

  @Post()
  newUser(@Body() body: User) {
    return this.usersService.newUser(body);
  }
}
