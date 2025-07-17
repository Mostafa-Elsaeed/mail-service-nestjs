import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
// import { Attachment, Recipient } from '../config/message-dto.config';
import { ApiProperty } from '@nestjs/swagger';
import { Sender } from './helper-dto/sender.dto';
import { Recipient } from './helper-dto/recipient.dto';
import { Attachment } from './helper-dto/attachement.dto';
// import { Sender, Recipient, Attachment } from '../interfaces'; // Adjust import path as needed

export class SendMailDto {
  @IsString()
  @ApiProperty({
    example: 'Your email subject here',
    description: 'The subject of the email',
  })
  subject: string;

  @IsString()
  @ApiProperty({
    example: '<p>Your email content in HTML format</p>',
    description: 'The HTML content of the email',
  })
  html: string;

  @IsString()
  @ApiProperty({
    example: 'Your email content in plain text',
    description: 'The plain text content of the email',
  })
  plainText: string;

  @ValidateNested()
  sender: Sender;

  @IsArray()
  @ValidateNested({ each: true })
  recipients: Recipient[];

  @IsArray()
  @IsOptional()
  cc: Recipient[];

  @IsArray()
  @IsOptional()
  bcc: Recipient[];

  @IsString()
  @IsEmail()
  @IsOptional()
  sendForEmail: string;

  @IsArray()
  @IsOptional()
  attachments: Attachment[];

  @IsBoolean()
  @IsOptional()
  save: boolean = true;

  @IsString()
  @IsOptional()
  batchId: string;

  @IsString()
  @IsOptional()
  messageLogId: string;

  @IsString()
  @IsOptional()
  templateId: string;
}
