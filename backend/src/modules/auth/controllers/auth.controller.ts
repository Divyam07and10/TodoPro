import { Controller, Get, Req, Res, UseGuards, Post } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../services/auth.service';
import { JwtAuthGuard } from '../../../common/guards/jwt.guard';
import { RefreshTokenGuard } from '../guards/refresh-token.guard';
import { RequestWithUser } from 'src/modules/auth/types/request-with-user.interface';
import { refreshTokenCookieOptions } from 'src/config/cookie.config';
import { ApiKeyGuard } from '../../../common/guards/api-key.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Redirect to Google
  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth() {}

  // Google OAuth callback
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    const user = req.user;
    const { access_token, refresh_token } =
      await this.authService.loginWithGoogle(user as any);

    res.cookie('refresh_token', refresh_token, refreshTokenCookieOptions);
    //res.redirect(`/index.html?access_token=${access_token}`);
    res.redirect(`http://localhost:3000/dashboard?access_token=${access_token}`);
  }

  // Refresh token endpoint
  @Post('refresh')
  @UseGuards(ApiKeyGuard, RefreshTokenGuard)
  async refreshAccessToken(@Req() req: RequestWithUser, @Res() res: Response) {
    const userId = req.user.sub;
    const refreshToken = req.refreshToken;

    const { access_token } = await this.authService.refreshTokens(
      userId,
      refreshToken,
    );

    return res.json({ access_token });
  }

  //Logout
  @Post('logout')
  @UseGuards(ApiKeyGuard, JwtAuthGuard)
  async logout(@Req() req: RequestWithUser, @Res() res: Response) {
    await this.authService.logout(req.user.sub);

    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
      domain: 'localhost',
    });

    return res.json({ message: 'Logged out successfully' });
  }
}
