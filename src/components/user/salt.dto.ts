import { IsInt, IsString, Min, MinLength } from 'class-validator';

export class SaltDto {
  @IsInt()
  @Min(1)
  readonly id: number;

  @IsString()
  @MinLength(64, { message: 'hash位数不能小于64' })
  readonly salt: string;
}
