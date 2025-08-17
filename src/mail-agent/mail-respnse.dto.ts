import { ApiProperty } from '@nestjs/swagger';

export class MailResultDto {
  @ApiProperty({
    description: 'Whether the mail was sent successfully',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: "Provider's external identifier for the sent email",
    example: 'sg-1234567890',
    required: false,
  })
  externalId?: string;

  @ApiProperty({
    description: 'Error code if the mail sending failed',
    example: 'SMTP_TIMEOUT',
    required: false,
  })
  errorCode?: string;

  @ApiProperty({
    description: 'How many times this request was retried',
    example: 1,
    required: false,
  })
  retryCount?: number;
}
