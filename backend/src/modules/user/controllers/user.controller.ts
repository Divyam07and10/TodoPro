import {
  Controller,
  Get,
  Patch,
  UseGuards,
  Req,
  Body,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserResponse } from '../types/user-response.interface';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { RequestWithUser } from 'src/modules/auth/types/request-with-user.interface';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/config/multer.config';
import { ApiKeyGuard } from 'src/common/guards/api-key.guard';

@UseGuards(ApiKeyGuard, JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  //Get user profile
  @Get('me')
  getProfile(@Req() req: RequestWithUser): Promise<UserResponse | null> {
    return this.userService.getMe(req.user.sub);
  }

  //Update user profile (avatar, bio, and name)
  @Patch('me')
  @UseInterceptors(FileInterceptor('avatar', multerConfig))
  updateProfile(
    @Req() req: RequestWithUser,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UpdateUserDto,
  ): Promise<UserResponse> {
    return this.userService.updateMe(req.user.sub, dto, file);
  }
}
