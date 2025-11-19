import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

/**
 * Pipe personalizado para validar que el campo 'field' sea estrictamente 'email' o 'username'
 * Previene inyección de campos no permitidos
 */
@Injectable()
export class FieldValidationPipe implements PipeTransform {
  private readonly allowedFields = ['email', 'username'] as const;

  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type === 'body' && value?.field) {
      if (!this.allowedFields.includes(value.field)) {
        throw new BadRequestException(
          `El campo 'field' debe ser uno de: ${this.allowedFields.join(', ')}`,
        );
      }
    }
    return value;
  }
}
