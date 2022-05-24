import {
  IsString,
  IsInt,
  IsNotEmpty,
  Min,
} from 'class-validator';

export class WebsocketDto {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsInt()
  @Min(0)
  docId: number;

  @IsString()
  @IsNotEmpty()
  raw: string;
}
