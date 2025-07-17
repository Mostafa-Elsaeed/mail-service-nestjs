import { IsOptional, IsString } from 'class-validator';

export class Sender {
  @IsString() email: string;

  @IsOptional() @IsString() name?: string;
}
