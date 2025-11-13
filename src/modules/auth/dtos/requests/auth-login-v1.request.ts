import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';
import { ZodUtils } from '../../../../shared/utils/zod.util';
import { ErrorMessageConstant } from '../../../../shared/constants/message.constant';

const AuthLoginSchema = z.object({
  email: z.string().email(ErrorMessageConstant.InvalidEmailFormat),
  password: z
    .string()
    .min(1, ErrorMessageConstant.FieldRequiredWithName('password')),
});

export class AuthLoginV1Request extends ZodUtils.createStrictCamelCaseDto(
  AuthLoginSchema,
) {
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Registered email address',
  })
  email!: string;

  @ApiProperty({ example: 'SecurePass123', description: 'User password' })
  password!: string;
}
