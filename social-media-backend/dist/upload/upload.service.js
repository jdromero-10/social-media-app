"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var UploadService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadService = exports.ImageType = void 0;
const common_1 = require("@nestjs/common");
const fs_1 = require("fs");
const path_1 = require("path");
const uuid = __importStar(require("uuid"));
var ImageType;
(function (ImageType) {
    ImageType["USER_AVATAR"] = "users";
    ImageType["POST_IMAGE"] = "posts";
})(ImageType || (exports.ImageType = ImageType = {}));
let UploadService = UploadService_1 = class UploadService {
    logger = new common_1.Logger(UploadService_1.name);
    uploadsDir = (0, path_1.join)(process.cwd(), 'images');
    constructor() {
        this.ensureDirectoriesExist();
    }
    ensureDirectoriesExist() {
        const usersDir = (0, path_1.join)(this.uploadsDir, ImageType.USER_AVATAR);
        const postsDir = (0, path_1.join)(this.uploadsDir, ImageType.POST_IMAGE);
        [this.uploadsDir, usersDir, postsDir].forEach((dir) => {
            if (!(0, fs_1.existsSync)(dir)) {
                (0, fs_1.mkdirSync)(dir, { recursive: true });
                this.logger.log(`Directorio creado: ${dir}`);
            }
        });
    }
    validateImageFile(file) {
        if (!file) {
            throw new common_1.BadRequestException('No se proporcionó ningún archivo');
        }
        const allowedMimeTypes = [
            'image/jpeg',
            'image/jpg',
            'image/png',
            'image/gif',
            'image/webp',
        ];
        if (!allowedMimeTypes.includes(file.mimetype)) {
            throw new common_1.BadRequestException('Tipo de archivo no permitido. Solo se permiten imágenes (JPEG, PNG, GIF, WebP)');
        }
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            throw new common_1.BadRequestException('El archivo no debe exceder los 5MB');
        }
    }
    generateFileName(originalName) {
        const extension = originalName.split('.').pop()?.toLowerCase() || 'jpg';
        const uniqueId = uuid.v4();
        return `${uniqueId}.${extension}`;
    }
    async uploadImage(file, imageType) {
        this.validateImageFile(file);
        const fileName = this.generateFileName(file.originalname);
        const uploadPath = (0, path_1.join)(this.uploadsDir, imageType, fileName);
        try {
            (0, fs_1.writeFileSync)(uploadPath, file.buffer);
            this.logger.log(`Imagen guardada: ${uploadPath}`);
            const url = `/images/${imageType}/${fileName}`;
            return url;
        }
        catch (error) {
            this.logger.error(`Error al guardar imagen: ${error}`);
            throw new common_1.BadRequestException('Error al guardar la imagen');
        }
    }
    async deleteImage(imageUrl) {
        if (!imageUrl || !imageUrl.startsWith('/images/')) {
            return;
        }
        const filePath = (0, path_1.join)(process.cwd(), imageUrl);
        try {
            if ((0, fs_1.existsSync)(filePath)) {
                (0, fs_1.unlinkSync)(filePath);
                this.logger.log(`Imagen eliminada: ${filePath}`);
            }
        }
        catch (error) {
            this.logger.error(`Error al eliminar imagen: ${error}`);
        }
    }
};
exports.UploadService = UploadService;
exports.UploadService = UploadService = UploadService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], UploadService);
//# sourceMappingURL=upload.service.js.map