import {
  IsInt,
  Min,
  IsString,
  MaxLength,
  IsOptional,
  IsIn,
} from 'class-validator';

export class DocUpdateDto {
  @IsInt()
  @Min(0)
  readonly id: number;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  readonly name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  readonly desc?: string;

  @IsOptional()
  @IsString()
  readonly content?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  readonly cover?: string;

  @IsOptional()
  @IsString()
  readonly update_time?: string;
}

export class DocCreateDto {
  @IsOptional()
  @IsString()
  @MaxLength(20)
  readonly name: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  readonly desc: string;

  @IsOptional()
  @IsString()
  readonly content: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  readonly cover?: string;

  @IsInt()
  readonly creator: number;
}

export class DocDetailDto {
  @IsString()
  readonly id: string;
}

export class GetDocListDto {
  @IsString()
  readonly userId: string;
}

export class DeleteDocDto {
  @IsString()
  readonly docId: string;
}
