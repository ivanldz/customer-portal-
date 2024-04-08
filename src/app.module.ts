import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './users/user.module';
import { CompaniesModule } from './companies/companies.module';
import { User } from './users/entities/user.entity';
import { Company } from './companies/entities/company.entity';
import { Permission } from './auth/entities/permissions.entity';
import { Role } from './auth/entities/roles.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClaimsModule } from './claims/claims.module';
import { TotemModule } from './totem/totem.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ZodValidationPipe } from 'nestjs-zod';
import { APP_PIPE } from '@nestjs/core';

@Module({
  imports: [
    AuthModule,
    UserModule,
    CompaniesModule,
    ClaimsModule,
    TotemModule,
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DATABASE_HOST'),
        port: config.get('DATABASE_PORT'),
        username: config.get('DATABASE_USERNAME'),
        password: config.get('DATABASE_PASSWORD'),
        database: config.get('DATABASE_NAME'),
        entities: [User, Company, Role, Permission],
        synchronize: true,
      }),
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const smtpUsername = config.get('EMAIL_USER');
        const smtpPassword = config.get('EMAIL_PASSWORD');
        return {
          transport: `smtps://${smtpUsername}:${smtpPassword}@smtp.gmail.com`,
          defaults: {
            from: '"nest-modules" <modules@nestjs.com>',
          },
          template: {
            dir: './templates',
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            },
          },
        };
      },
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
  ],
})
export class AppModule {}
