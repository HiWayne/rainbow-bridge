import { Headers } from '~/enums/index';

const verifyHeaders = checkFn => (headers, ...args) => {
  if (headers !== null && typeof headers === 'object') {
    return checkFn(headers, ...args);
  } else {
    return false;
  }
};

export const checkUser = verifyHeaders(headers => {
  const access_token = headers[Headers.access_token];
});

export const checkRefresh = verifyHeaders(headers => {
  const refresh_token = headers[Headers.refresh_token];
});
