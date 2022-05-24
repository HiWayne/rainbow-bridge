import { IsInt, Min } from 'class-validator';

export class IterateDto {
  @IsInt()
  @Min(1)
  readonly id: number;

  @IsInt()
  @Min(5000, { message: '派生次数不能小于5000' })
  readonly iterate: number;
}
