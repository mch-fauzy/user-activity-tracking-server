import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';
import { ZodUtils } from '../../../../shared/utils/zod.util';
import { ErrorMessageConstant } from '../../../../shared/constants/message.constant';

const LogCreateV1Schema = z.object({
  ipAddress: z.union([z.ipv4(), z.ipv6()]).refine((val) => val, {
    message: ErrorMessageConstant.FieldInvalidValueWithName(
      'ipAddress',
      'valid IPv4 or IPv6 address',
    ),
  }),
  endpoint: z
    .string()
    .min(1, ErrorMessageConstant.FieldRequiredWithName('endpoint')),
  method: z
    .string()
    .min(1, ErrorMessageConstant.FieldRequiredWithName('method')),
  timestamp: z
    .number()
    .int()
    .positive(
      ErrorMessageConstant.FieldInvalidValueWithName(
        'timestamp',
        'positive Unix timestamp',
      ),
    ),
});

export class LogCreateV1Request extends ZodUtils.createStrictCamelCaseDto(
  LogCreateV1Schema,
) {
  @ApiProperty({
    example: '192.168.1.100',
    description: 'Client IP address (IPv4 or IPv6)',
  })
  ipAddress!: string;

  @ApiProperty({
    example: '/usage',
    description: 'API endpoint path that was accessed',
  })
  endpoint!: string;

  @ApiProperty({ example: 'GET', description: 'HTTP method' })
  method!: string;

  @ApiProperty({
    example: 1763039685830,
    description: 'Unix timestamp in milliseconds',
  })
  timestamp!: number;
}
