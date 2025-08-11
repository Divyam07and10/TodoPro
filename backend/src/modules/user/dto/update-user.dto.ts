import { IsOptional, IsString, MaxLength } from 'class-validator';
import { Trim, Escape } from 'class-sanitizer';
export class UpdateUserDto {
  
  @Trim()
  @Escape()
  @IsOptional()
  @IsString()
  name?: string;

  @Trim()
  @Escape()
  @IsOptional()
  @IsString()
  @MaxLength(200)
  bio?: string;

  @IsOptional()
  avatar?: string | null;
}
