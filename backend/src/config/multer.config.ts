import { BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';

export const multerConfig = {
  storage: diskStorage({
    destination: './uploads/avatars',
    filename: (_req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const fileExt = extname(file.originalname);
      cb(null, `${uniqueSuffix}${fileExt}`);
    },
  }),

  fileFilter: (_req: any, file: Express.Multer.File, cb: (error: Error | null, acceptFile: boolean) => void) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(new BadRequestException('Only image files (jpeg, jpg, png) are allowed!'), false);
    }
    cb(null, true);
  },

  limits: {
    fileSize: 2 * 1024 * 1024, // 2 MB
  },
};
