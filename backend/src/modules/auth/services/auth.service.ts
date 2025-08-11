import {
  Injectable,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { TokenService } from 'src/core/token/services/token.service';
import { LoginResponseDto } from '../dto/login-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tokenService: TokenService,
  ) {}

  async validateGoogleUser(
    email: string,
    name: string,
    avatar: string,
  ): Promise<User> {
    if (!email) throw new UnauthorizedException('Google account has no email');

    let user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email,
          name: name || 'Unnamed User',
          avatar,
          password: '',
        },
      });
    }

    return user;
  }

  async loginWithGoogle(user: User): Promise<LoginResponseDto> {
    const payload = { sub: user.id, email: user.email };

    const access_token = await this.tokenService.generateAccessToken(payload);
    const refresh_token = await this.tokenService.generateRefreshToken(payload);

    await this.updateHashedRefreshToken(user.id, refresh_token);

    return {
      access_token,
      refresh_token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
      },
    };
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user || !user.refreshToken) {
      throw new ForbiddenException('Access denied!');
    }

    const isMatch = await bcrypt.compare(refreshToken, user.refreshToken);

    if (!isMatch) {
      throw new ForbiddenException('Invalid refresh token');
    }

    const payload = { sub: user.id, email: user.email };

    const access_token = await this.tokenService.generateAccessToken(payload);
    const refresh_token = await this.tokenService.generateRefreshToken(payload);

    return { access_token, refresh_token };
  }

  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  }

  private async updateHashedRefreshToken(userId: string, token: string) {
    const hashed = await bcrypt.hash(token, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: hashed },
    });
  }
}
