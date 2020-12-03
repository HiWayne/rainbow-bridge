import {
  IsString,
  Length,
  Matches,
  MaxLength,
  MinLength,
  IsInt,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class UserCreateDTO {
  // 用户名
  @IsNotEmpty({ message: '缺少用户名' })
  @IsString()
  @Length(1, 15, { message: '用户名只能1-15个字符' })
  @Matches(/^[A-Za-z0-9\u4e00-\u9fa5_\-]{1,15}$/, {
    message: '用户名只支持汉字、字母、数字以及特殊字符-、_',
  })
  readonly name: string;

  // 密码
  @IsNotEmpty({ message: '缺少密码' })
  @IsString()
  @MinLength(8, { message: '密码不能少于8位' })
  @MaxLength(128, { message: '密码不能多于128位' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,128}$/, {
    message: '密码必须包含大小写字母和数字',
  })
  readonly password: string;

  // 用户描述（可选）
  @IsOptional()
  @IsString()
  @Length(0, 100, { message: '描述不能超过100字符' })
  readonly desc?: string;

  // 用户头像（可选）
  @IsOptional()
  @IsString()
  readonly avatar?: string;
}

export class UserFindByIdDTO {
  // 用户id
  @IsInt()
  readonly id?: number;
}

export class UserFindByNameDTO {
  // 用户名
  @IsString()
  @MaxLength(128, { message: '用户名长度非法' })
  readonly name?: string;
}
