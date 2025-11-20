import { UploadService } from './upload.service';
import { User } from '../users/entities/user.entity';
export declare class UploadController {
    private readonly uploadService;
    constructor(uploadService: UploadService);
    uploadUserAvatar(file: Express.Multer.File, req: {
        user: User;
    }): Promise<{
        imageUrl: string;
        message: string;
    }>;
    uploadPostImage(file: Express.Multer.File, req: {
        user: User;
    }): Promise<{
        imageUrl: string;
        message: string;
    }>;
}
