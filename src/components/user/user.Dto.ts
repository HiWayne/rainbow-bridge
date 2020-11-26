export declare class UserCreateDto {
  name: string;
  password: string;
  desc?: string;
  avatar?: string;
}

export declare class UserFindByIdDto {
  id?: number;
}

export declare class UserFindByNameDto {
  name?: string;
}
