import {
  PipeTransform,
  ArgumentMetadata,
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class VerifyPipe implements PipeTransform {
  async transform(value, { metatype }: ArgumentMetadata) {
    if (!metatype) {
      return value;
    }
    const transformedValue = plainToClass(metatype, value);
    const errors = await validate(transformedValue);
    const errorLenth = errors.length;
    if (errorLenth > 0) {
      throw new BadRequestException(Object.values(errors[0].constraints)[0]);
    }
    return transformedValue;
  }
}
