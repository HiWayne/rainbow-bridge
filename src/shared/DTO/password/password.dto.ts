import { IsInt, Min, IsString, MinLength } from 'class-validator';

export class passwordDTO {
  // 用户id，逻辑外键
  @IsInt()
  @Min(1)
  readonly id: number;

  @IsString()
  @MinLength(64, { message: 'hash位数不能小于64' })
  hash: string;
}
