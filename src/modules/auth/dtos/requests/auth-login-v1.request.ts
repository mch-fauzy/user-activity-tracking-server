import { ZodUtils } from '../../../../shared/utils/zod.util';
import { z } from 'zod';
import { ErrorMessageConstant } from '../../../../shared/constants/message.constant';

const AuthLoginSchema = z.object({
  email: z.string().email(ErrorMessageConstant.InvalidEmailFormat),
  password: z
    .string()
    .min(1, ErrorMessageConstant.FieldRequiredWithName('password')),
});

export class AuthLoginV1Request extends ZodUtils.createStrictCamelCaseDto(
  AuthLoginSchema,
) {}
