import { HttpException, HttpStatus } from '@nestjs/common';
import { PipeTransform } from '@nestjs/common';
import { ZodObject } from 'zod';

export class Validator implements PipeTransform {
  constructor(private schema: ZodObject<any>) {}

  transform(value: unknown) {
    try {
      this.schema.parse(value);
    } catch (error) {
      throw new ValidException(error);
    }
    return value;
  }
}

export class ValidException extends HttpException {
  constructor(errorObject: Record<string, any>) {
    errorObject.name = undefined;
    super(
      { error: errorObject, message: '<BAD_REQUEST> Schema parse error' },
      HttpStatus.BAD_REQUEST,
    );
  }
}
