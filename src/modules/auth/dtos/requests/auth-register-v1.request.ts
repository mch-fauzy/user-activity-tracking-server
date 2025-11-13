import { ZodUtils } from '../../../../shared/utils/zod.util';
import { z } from 'zod';
import { Regex } from '../../../../shared/constants/regex.constant';
import { ErrorMessageConstant } from '../../../../shared/constants/message.constant';

const AuthRegisterSchema = z.object({
  name: z.string().min(1, ErrorMessageConstant.FieldRequiredWithName('name')),
  email: z.string().email(ErrorMessageConstant.InvalidEmailFormat),
  password: z
    .string()
    .min(8, ErrorMessageConstant.PasswordTooShort(8))
    .regex(Regex.Password, ErrorMessageConstant.PasswordTooWeak),
});

export class AuthRegisterV1Request extends ZodUtils.createStrictCamelCaseDto(
  AuthRegisterSchema,
) {}
