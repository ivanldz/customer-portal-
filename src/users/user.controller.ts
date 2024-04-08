import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UsePipes,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Auth } from 'src/auth/decorators/auth.decorators';
import { RequestWithUser } from 'src/auth/interfaces/request-user';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { User } from './entities/user.entity';
import { Pagination } from 'src/global/interface/pagniation';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ZodValidationPipe } from 'nestjs-zod';
import { UpdateUserDto } from './dto/update-user.dto';
import { MessageResponse } from 'src/global/interface/message-response';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiBearerAuth()
  @Auth('admin')
  @UsePipes(ZodValidationPipe)
  create(
    @Req() { user }: RequestWithUser,
    @Body() { email, roleId }: CreateUserDto,
  ): Promise<any> {
    return this.userService.createSubUser(user, email, roleId);
  }

  @Get()
  @ApiBearerAuth()
  @Auth('admin')
  getUsers(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
    @Req() { user }: RequestWithUser,
  ): Promise<Pagination<User>> {
    return this.userService.findAll(page, pageSize, user.email);
  }

  @Put(':id')
  @ApiBearerAuth()
  @Auth('admin')
  @UsePipes(ZodValidationPipe)
  async update(
    @Param('id') id: string,
    @Body() { roleId }: UpdateUserDto,
  ): Promise<MessageResponse> {
    await this.userService.update(parseInt(id), roleId);
    return { message: 'record updated' };
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Auth('admin')
  remove(@Param('id') id: string): Promise<User> {
    return this.userService.remove(parseInt(id));
  }

  @Post('activate')
  @UsePipes(ZodValidationPipe)
  async activateUser(
    @Query('token') token: string,
    @Body() { password, repeatePassword }: ResetPasswordDto,
  ): Promise<MessageResponse> {
    if (!token) {
      throw new BadRequestException('Token is null');
    }
    await this.userService.activateUser(token, password, repeatePassword);
    return { message: 'activated user successfully' };
  }
}
