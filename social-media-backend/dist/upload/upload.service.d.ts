export declare enum ImageType {
    USER_AVATAR = "users",
    POST_IMAGE = "posts"
}
export declare class UploadService {
    private readonly logger;
    private readonly uploadsDir;
    constructor();
    private ensureDirectoriesExist;
    private validateImageFile;
    private generateFileName;
    uploadImage(file: Express.Multer.File, imageType: ImageType): Promise<string>;
    deleteImage(imageUrl: string): Promise<void>;
}
