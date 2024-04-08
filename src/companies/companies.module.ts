import { Module } from '@nestjs/common';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { UserService } from 'src/users/user.service';
import { User } from 'src/users/entities/user.entity';
import { Role } from 'src/auth/entities/roles.entity';
import { UserModule } from 'src/users/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Company, User, Role]), UserModule],
  controllers: [CompaniesController],
  providers: [CompaniesService, UserService],
})
export class CompaniesModule {}
