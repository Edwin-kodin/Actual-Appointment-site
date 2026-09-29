import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { UsersModule } from '../users/users.module.js';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET', 'super_secret_glowgh_key'),
        signOptions: { 
          expiresIn: configService.get<string>('JWT_EXPIRES_IN', '7d') as any
        },
      }),
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}
