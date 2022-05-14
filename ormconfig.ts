export const securityConfig = {
  type: 'mysql',
  host: '0.0.0.0',
  port: 3306,
  username: 'root',
  password: '123456',
  synchronize: false,
  database: 'security',
  entities: ['src/authority/**.entity.ts', 'src/user/**.entity.ts'],
  timezone: '+0800',
};

export const docsConfig = {
  type: 'mysql',
  host: '0.0.0.0',
  port: 3306,
  username: 'root',
  password: '123456',
  synchronize: false,
  database: 'doc',
  entities: ['src/doc/**.entity.ts'],
  timezone: '+0800',
};
