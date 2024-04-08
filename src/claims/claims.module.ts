import { Module } from '@nestjs/common';
import { ClaimsController } from './claims.controller';
import { ClaimsService } from './claims.service';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/users/user.module';
import { UserService } from 'src/users/user.service';
import { User } from 'src/users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from 'src/auth/entities/roles.entity';
import { Permission } from 'src/auth/entities/permissions.entity';

@Module({
  imports: [
    JwtModule,
    UserModule,
    TypeOrmModule.forFeature([User, Role, Permission]),
  ],
  controllers: [ClaimsController],
  providers: [ClaimsService, UserService],
})
export class ClaimsModule {}
