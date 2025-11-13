import { createZodDto, ZodValidationException } from 'nestjs-zod';
import { z } from 'zod';
import { StringUtil } from './string.util';
import { IZodValidationErrorFormat } from '../interfaces/zod-validation-error-format.interface';

export class ZodUtils {
  static createStrictCamelCaseDto<T extends z.ZodObject<z.ZodRawShape>>(
    schema: T,
  ) {
    return createZodDto(
      z.preprocess((data) => {
        if (typeof data === 'object' && data !== null) {
          return StringUtil.camelCaseKey(data as Record<string, unknown>);
        }
        return data;
      }, schema),
    );
  }

  static zodValidationResponseFormat(
    exception: ZodValidationException,
  ): IZodValidationErrorFormat[] {
    const issues = (exception.getZodError() as z.ZodError).issues;

    const errorMap = new Map<string, string[]>();

    issues.forEach((issue) => {
      const pathString = issue.path
        .map((item) => StringUtil.snakeCase(item.toString()))
        .join('.');
      const existingMessages = errorMap.get(pathString) || [];

      existingMessages.push(issue.message);

      errorMap.set(pathString, existingMessages);
    });

    const result: IZodValidationErrorFormat[] = [];

    errorMap.forEach((messages, path) => {
      result.push({
        path,
        messages,
      });
    });

    return result;
  }
}
