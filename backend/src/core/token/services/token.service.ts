import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {
    constructor(
        private readonly jwt: JwtService,
        private readonly config: ConfigService,
    ) {}

    async generateAccessToken(payload: any): Promise<string> {
        return this.jwt.signAsync(payload, {
            secret: this.config.getOrThrow<string>('jwt.accessTokenSecret'),
            expiresIn: this.config.getOrThrow<string>('jwt.accessTokenExpiresIn'),
        });
    }

    async generateRefreshToken(payload: any): Promise<string> {
        return this.jwt.signAsync(payload, {
            secret: this.config.getOrThrow<string>('jwt.refreshTokenSecret'),
            expiresIn: this.config.getOrThrow<string>('jwt.refreshTokenExpiresIn'),
        });
    }
}
