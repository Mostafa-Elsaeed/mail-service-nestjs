import { IsOptional, IsString } from 'class-validator';

export class Recipient {
  @IsString() email: string;

  @IsOptional() @IsString() name?: string;
}
