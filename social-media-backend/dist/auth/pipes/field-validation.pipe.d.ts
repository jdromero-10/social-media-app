import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
export declare class FieldValidationPipe implements PipeTransform {
    private readonly allowedFields;
    transform(value: any, metadata: ArgumentMetadata): any;
}
