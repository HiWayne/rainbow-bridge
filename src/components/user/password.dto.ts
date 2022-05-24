import { IsInt, Min, IsString, MinLength } from 'class-validator';

export class PasswordDto {
  // 用户id，逻辑外键
  @IsInt()
  @Min(1)
  readonly id: number;

  @IsString()
  @MinLength(64, { message: 'hash位数不能小于64' })
  readonly hash: string;
}
