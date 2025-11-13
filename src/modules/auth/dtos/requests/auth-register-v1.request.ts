import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';
import { ZodUtils } from '../../../../shared/utils/zod.util';
import { Regex } from '../../../../shared/constants/regex.constant';
import { ErrorMessageConstant } from '../../../../shared/constants/message.constant';

const AuthRegisterSchema = z.object({
  name: z.string().min(1, ErrorMessageConstant.FieldRequiredWithName('name')),
  email: z.email(ErrorMessageConstant.InvalidEmailFormat),
  password: z
    .string()
    .min(8, ErrorMessageConstant.PasswordTooShort(8))
    .regex(
      Regex.PasswordMustContainUpperLowerDigit,
      ErrorMessageConstant.PasswordTooWeak,
    ),
});

export class AuthRegisterV1Request extends ZodUtils.createStrictCamelCaseDto(
  AuthRegisterSchema,
) {
  @ApiProperty({ example: 'John Doe', description: 'Full name of the client' })
  name!: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Valid email address (must be unique)',
  })
  email!: string;

  @ApiProperty({
    example: 'SecurePass123',
    description:
      'Password (must contain uppercase, lowercase, and numbers, minimum 8 characters)',
  })
  password!: string;
}
