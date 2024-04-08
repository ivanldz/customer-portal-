import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/auth/entities/roles.entity';
import { Company } from 'src/companies/entities/company.entity';
import { v4 as uuid } from 'uuid';
import { UserInfo } from './interface/user-info';
import { PayloadToken } from 'src/auth/interfaces/payload-jwt';
import { ConfigService } from '@nestjs/config';
import { Pagination } from 'src/global/interface/pagniation';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class UserService {
  constructor(
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async create(
    email: string,
    password: string,
    role: Role,
    company: Company,
  ): Promise<User> {
    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(password, salt);
    const user = await this.userRepository.save({
      email: email,
      role: role,
      hash: hashedPassword,
      salt: salt,
      company: company,
    });

    return user;
  }

  async createSubUser(
    admin: PayloadToken,
    email: string,
    roleId: number,
  ): Promise<UserInfo> {
    const userAdmin = await this.getUser(admin.email);
    const role = await this.roleRepository.findOneBy({ id: roleId });
    if (!role) {
      throw new BadRequestException('Role not found');
    }

    const activationToken = uuid();
    const host = this.configService.get<string>('FRONTEND_HOST');
    const activationLink = `${host}/generar-contrasena?token=${activationToken}`;
    this.sendActivationToUser(email, activationLink);

    return this.userRepository.save({
      email: email,
      role: role,
      company: userAdmin.company,
      resetPasswordToken: activationToken,
    });
  }

  async createAdmin(
    email: string,
    password: string,
    company: Company,
  ): Promise<User> {
    const role = await this.roleRepository
      .createQueryBuilder('role')
      .where('LOWER(role.name) ILIKE LOWER(:name)', { name: `%admin%` })
      .getOne();
    return this.create(email, password, role, company);
  }

  async resetPasswordToken(userId: number): Promise<string> {
    const token = uuid();
    await this.userRepository.save({
      id: userId,
      resetPasswordToken: token,
    });

    return token;
  }

  async getUser(email: string): Promise<User> {
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email: email })
      .leftJoinAndSelect('user.role', 'role')
      .leftJoinAndSelect('role.permissions', 'permissions')
      .leftJoinAndSelect('user.company', 'company')
      .getOne();
  }

  getSessionInfo(user: User): UserInfo {
    return {
      id: user.id,
      email: user.email,
      company: user.company,
      role: {
        id: user.role.id,
        name: user.role.name,
        permissions: user.role.permissions.map(({ name, id }) => {
          return { id, name };
        }),
      },
    };
  }

  async activateUser(
    token: string,
    password: string,
    repeatePassword: string,
  ): Promise<void> {
    if (password != repeatePassword) {
      throw new BadRequestException('Passwords are not the same');
    }

    const user = await this.userRepository.findOneBy({
      resetPasswordToken: token,
    });
    if (!user) {
      throw new ForbiddenException('Token is not valid');
    }

    await this.savePassword(user, password);
  }

  async savePassword(user: User, password: string): Promise<void> {
    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(password, salt);
    await this.userRepository.update(
      {
        id: user.id,
      },
      {
        resetPasswordToken: null,
        hash: hashedPassword,
        salt: salt,
      },
    );
  }

  async findAll(
    page: number,
    pageSize: number,
    userEmail: string,
  ): Promise<Pagination<User>> {
    const user = await this.getUser(userEmail);
    const companyId = user.company.id;
    const skip = (page - 1) * pageSize;

    const [records, total] = await this.userRepository
      .createQueryBuilder('user')
      .select(['user.id', 'user.email', 'user.createdAt', 'user.updatedAt'])
      .where('user.company = :companyId', { companyId })
      .leftJoinAndSelect('user.role', 'role')
      .leftJoinAndSelect('user.company', 'company')
      .skip(skip)
      .take(pageSize)
      .getManyAndCount();

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

  async findOneBy(filter: any) {
    const user = await this.userRepository.findOneBy(filter);
    return user;
  }

  async remove(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    return this.userRepository.remove(user);
  }

  async update(id: number, roleId: number): Promise<void> {
    const role = await this.roleRepository.findOneBy({ id: roleId });
    if (!role) {
      throw new BadRequestException('Role not found');
    }
    await this.userRepository.update({ id }, { role: role });
  }

  async sendActivationToUser(
    email: string,
    activationLink: string,
  ): Promise<void> {
    const sender = this.configService.get<string>('EMAIL_USER');
    await this.mailerService.sendMail({
      to: email,
      from: sender,
      subject: 'Activar nuevo usuario',
      template: 'new-subuser',
      context: { activationLink, email },
    });
  }
}
