import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { GoogleStrategy } from './strategies/google.strategy';
import { TokenModule } from 'src/core/token/token.module';
import { ApiKeyGuard } from '../../common/guards/api-key.guard';

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    TokenModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        secret: config.get<string>('jwt.accessTokenSecret'),
        signOptions: {
          expiresIn: config.get<string>('jwt.accessTokenExpiresIn'),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, PrismaService, GoogleStrategy, ApiKeyGuard],
})
export class AuthModule {}
