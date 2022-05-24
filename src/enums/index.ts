export type Authentication = {
  [key in AuthenticationTypes]?: Headers[];
};

export enum AuthenticationTypes {
  USER = 'USER',
  REFRESH = 'REFRESH',
}

export enum Roles {
  NORMAL = 'NORMAL',
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
}

export enum Headers {
  access_token = 'access_token',
  refresh_token = 'refresh_token',
}

interface Config {
  ITERATECOUNT: number;
  authentication: Authentication;
  privateKeyPath: string;
  publicKeyPath: string;
}

const config: Config = {
  ITERATECOUNT: 10000,
  authentication: {
    [AuthenticationTypes.USER]: [Headers.access_token],
    [AuthenticationTypes.REFRESH]: [Headers.refresh_token],
  },
  privateKeyPath: '/data/private.key',
  publicKeyPath: '/data/public.key',
};

export default config;
