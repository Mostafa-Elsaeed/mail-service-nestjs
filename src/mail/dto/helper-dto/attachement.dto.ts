import { IsString } from 'class-validator';

export class Attachment {
  @IsString() fileType: string;

  @IsString() fileName: string;

  @IsString() fileURLPath: string;
}
