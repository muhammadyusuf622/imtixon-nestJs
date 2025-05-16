import { IsString, IsUUID } from 'class-validator';

export class IdParamDto {
  @IsString()
  @IsUUID()
  id: string;
}