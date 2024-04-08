import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Role } from './entities/roles.entity';
import { Pagination } from 'src/global/interface/pagniation';
import { CreateRole } from './dto/create-rol.dto';
import { CreatePermission } from './dto/create-permission.dto';
import { Permission } from './entities/permissions.entity';
import { Login } from './dto/login.dto';
import { SuccessfulLogin } from './interfaces/successful-login';
import { RequestWithUser } from './interfaces/request-user';
import { AuthGuard } from './guards/auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ZodValidationPipe } from 'nestjs-zod';
import { ResetPasswordDto } from 'src/users/dto/reset-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { MessageResponse } from 'src/global/interface/message-response';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('roles')
  @UsePipes(ZodValidationPipe)
  async createRole(@Body() createRoleDto: CreateRole): Promise<Role> {
    return this.authService.createRole(createRoleDto);
  }

  @Get('roles')
  async findAllRoles(
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
  ): Promise<Pagination<Role>> {
    return this.authService.findAllRoles(page, pageSize);
  }

  @Delete('roles/:id')
  async removeRole(@Param('id') id: number): Promise<Role> {
    return this.authService.removeRole(id);
  }

  @Post('permissions')
  @UsePipes(ZodValidationPipe)
  async createPermission(
    @Body() createPermissionDto: CreatePermission,
  ): Promise<Permission> {
    return this.authService.createPermission(createPermissionDto);
  }

  @Get('permissions')
  async findAllPermissions(
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
  ): Promise<Pagination<Permission>> {
    return this.authService.findAllPermissions(page, pageSize);
  }

  @Delete('permissions/:id')
  async removePermission(@Param('id') id: number): Promise<Permission> {
    return this.authService.removePermission(id);
  }

  @Post('login')
  @UsePipes(ZodValidationPipe)
  login(@Body() login: Login): Promise<SuccessfulLogin> {
    return this.authService.login(login);
  }

  @Get('me')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async profile(@Request() req: RequestWithUser): Promise<SuccessfulLogin> {
    return this.authService.getProfile(req.user.email);
  }

  @Post('forgot-password')
  @UsePipes(ZodValidationPipe)
  forgotPassword(@Body() { email }: ForgotPasswordDto): Promise<void> {
    return this.authService.forgotPassword(email);
  }

  @Post('reset-password')
  @UsePipes(ZodValidationPipe)
  async resetPassword(
    @Query('token') token: string,
    @Body() { password, repeatePassword }: ResetPasswordDto,
  ): Promise<MessageResponse> {
    if (!token) {
      throw new BadRequestException('Token is null');
    }
    await this.authService.resetPassword(token, password, repeatePassword);
    return { message: 'updated user successfully' };
  }
}
