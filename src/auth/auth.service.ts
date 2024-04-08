import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { Role } from './entities/roles.entity';
import { Pagination } from 'src/global/interface/pagniation';
import { Permission } from './entities/permissions.entity';
import { CreateRole } from './dto/create-rol.dto';
import { CreatePermission } from './dto/create-permission.dto';
import { Login } from './dto/login.dto';
import { SuccessfulLogin } from './interfaces/successful-login';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/users/user.service';
import { UserInfo } from '../users/interface/user-info';
import { PayloadToken } from './interfaces/payload-jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async createRole({ name, permissionsId }: CreateRole): Promise<Role> {
    const permissions = await this.permissionRepository
      .createQueryBuilder('permissions')
      .where('permissions.id IN (:...ids)', { ids: permissionsId })
      .getMany();

    if (permissions.length != permissionsId.length) {
      throw new BadRequestException(
        'one of the permissions entered does not exist',
      );
    }

    return this.roleRepository.save({ name, permissions });
  }

  async findAllRoles(
    page: number = 1,
    pageSize: number = 10,
  ): Promise<Pagination<Role>> {
    const skip = (page - 1) * pageSize;
    const [records, total] = await this.roleRepository.findAndCount({
      skip,
      take: pageSize,
      relations: ['permissions'],
    });
    const totalPages = Math.ceil(total / pageSize);
    return {
      records,
      paginations: {
        page,
        pageSize,
        totalPages,
      },
    };
  }

  async removeRole(id: number): Promise<Role> {
    const role = await this.roleRepository.findOneBy({ id });
    return this.roleRepository.remove(role);
  }

  async createPermission(create: CreatePermission): Promise<Permission> {
    return this.permissionRepository.save(create);
  }

  async findAllPermissions(
    page: number = 1,
    pageSize: number = 10,
  ): Promise<Pagination<Permission>> {
    const skip = (page - 1) * pageSize;
    const [records, total] = await this.permissionRepository.findAndCount({
      skip,
      take: pageSize,
    });
    const totalPages = Math.ceil(total / pageSize);
    return {
      records,
      paginations: {
        page,
        pageSize,
        totalPages,
      },
    };
  }

  async removePermission(id: number): Promise<Permission> {
    const permission = await this.permissionRepository.findOneBy({ id });
    return this.permissionRepository.remove(permission);
  }

  async login({ email, password }: Login): Promise<SuccessfulLogin> {
    const user = await this.userService.getUser(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.company.isActive) {
      throw new ForbiddenException('Company is not activated');
    }

    const passwordValid = await bcrypt.compare(password, user.hash);
    if (!passwordValid) {
      throw new ForbiddenException('Passowrd incorrect');
    }
    const session = this.userService.getSessionInfo(user);

    return {
      message: 'AUTHORIZE',
      user: this.userService.getSessionInfo(user),
      token: this.getJwt(session),
      expiration: this.getExpiration(),
    };
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.userService.getUser(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const token = await this.userService.resetPasswordToken(user.id);
    const host = this.configService.get<string>('FRONTEND_HOST');
    const link = `${host}/generar-contrasena?token=${token}`;
    const sender = this.configService.get<string>('EMAIL_USER');
    await this.mailerService.sendMail({
      to: user.email,
      from: sender,
      subject: 'Recupera tu contraseña',
      template: 'reset-password',
      context: { email, link },
    });
  }

  async resetPassword(
    token: string,
    password: string,
    repeatePassword: string,
  ): Promise<void> {
    if (password !== repeatePassword) {
      throw new BadRequestException('Password not match');
    }
    const user = await this.userService.findOneBy({
      resetPasswordToken: token,
    });

    if (!user) {
      throw new NotFoundException('Token not associated with any user');
    }

    return this.userService.savePassword(user, password);
  }

  async getProfile(email: string): Promise<SuccessfulLogin> {
    const user = await this.userService.getUser(email);
    const session = this.userService.getSessionInfo(user);

    return {
      message: 'OK',
      user: this.userService.getSessionInfo(user),
      token: this.getJwt(session),
      expiration: this.getExpiration(),
    };
  }

  private getJwt({ role, email }: UserInfo): string {
    const permissions = role.permissions.map(({ name }) => name);
    const tokenPayload: PayloadToken = { email, permissions };
    return this.jwtService.sign(tokenPayload, { expiresIn: '1h' });
  }

  private getExpiration(): number {
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;
    return now + oneHour;
  }
}
