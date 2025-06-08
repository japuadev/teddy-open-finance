import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { validate as isUUID } from 'uuid';

@Injectable()
export class CustomUuidPipe implements PipeTransform {
  transform(id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException('O ID deve ser um UUID válido.');
    }
    return id;
  }
}
