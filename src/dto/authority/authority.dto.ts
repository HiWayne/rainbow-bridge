import {
  IsString,
  Length,
  Matches,
  MaxLength,
  MinLength,
  IsInt,
  IsNotEmpty,
  IsOptional,
  Max,
} from 'class-validator';

export class GetRolesOfUser {
  @IsNotEmpty({ message: 'ids不能为空' })
  readonly ids: number | string;
}

export class SetRolesToUser {
  @IsInt({ message: '用户id必须要是数字' })
  @IsNotEmpty({ message: '用户id不能为空' })
  readonly id: number;

  @IsNotEmpty({ message: '角色不能为空' })
  readonly roles: number[];
}

export class CreateRoleDto {
  @MaxLength(20, { message: '名称不能超过20个字' })
  @IsString({ message: '名称必须是字符串' })
  @IsNotEmpty({ message: '名称不能为空' })
  readonly name: string;
}

export class CreateRoleByExtendDto {
  @MaxLength(20, { message: '名称不能超过20个字' })
  @IsString({ message: '名称必须是字符串' })
  @IsNotEmpty({ message: '名称不能为空' })
  readonly name: string;

  @IsInt({ message: 'extend必须是数字' })
  @IsNotEmpty({ message: 'extend的id不能为空' })
  readonly extend: number;
}

export class CreateAuthenticationDto {
  @MaxLength(20, { message: '名称不能超过20个字' })
  @IsString({ message: '名称必须是字符串' })
  @IsNotEmpty({ message: '名称不能为空' })
  readonly name: string;
}

export class RoleAddAuthenticationDto {
  @IsInt({ message: 'id必须是数字' })
  @IsNotEmpty({ message: 'id不能为空' })
  id: number;

  @IsNotEmpty({ message: 'authentications不能为空' })
  authentications: number[];
}

export class RoleRemoveAuthenticationDto {
  @IsInt({ message: 'id必须是数字' })
  @IsNotEmpty({ message: 'id不能为空' })
  id: number;

  @IsNotEmpty({ message: 'authentications不能为空' })
  authentications: number[];
}

export class DeleteRoleDto {
  @IsInt({ message: 'id必须是数字' })
  @IsNotEmpty({ message: 'id不能为空' })
  id: number;
}

export class DeleteAuthenticationDto {
  @IsInt({ message: 'id必须是数字' })
  @IsNotEmpty({ message: 'id不能为空' })
  id: number;
}
