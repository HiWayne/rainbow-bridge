import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { BadRequestException } from '@nestjs/common';
import { ClassType } from 'class-transformer/ClassTransformer';

export const isExist = value =>
  value !== undefined && value !== null && !Number.isNaN(value);

export const getTimeWithMillisecond = (n = 0, unit: string): number => {
  if (isNaN(Number(n)) || !unit) {
    throw new Error('getTimeWithMillisecond参数有误');
  }
  let coefficient = 1;
  switch (unit) {
    case 'second':
      coefficient = 1000;
      break;
    case 'minute':
      coefficient = 1000 * 60;
      break;
    case 'hour':
      coefficient = 1000 * 60 * 60;
      break;
    case 'day':
      coefficient = 1000 * 60 * 60 * 24;
      break;
    case 'month':
      coefficient = 1000 * 60 * 60 * 24 * 30;
      break;
    case 'year':
      coefficient = 1000 * 60 * 60 * 24 * 30 * 12;
      break;
    default:
      break;
  }
  return new Date().getTime() + n * coefficient;
};

function filterObject<T>(object: T): T {
  // @ts-ignore
  Reflect.ownKeys(object).forEach(key => {
    const value = object[key];
    if (!isExist(value)) {
      delete object[key];
    }
  });
  return object;
}

export async function transformClass<T, V>(
  cls: ClassType<T>,
  plain: V,
): Promise<T> {
  const transformedValue = plainToClass(cls, plain, {
    excludeExtraneousValues: true,
  });
  const errors = await validate(transformedValue);
  const errorLenth = errors.length;
  if (errorLenth > 0) {
    throw new BadRequestException(Object.values(errors[0].constraints)[0]);
  }
  return filterObject<T>(transformedValue);
}

const createRequestHandle = requestHandle => ({
  method: requestHandle && requestHandle.method ? requestHandle.method : 'get',
  handle: (request, reply, client) => {
    if (typeof requestHandle === 'function') {
      requestHandle(request, reply, client);
    } else {
      throw new Error('requestHandle should be function');
    }
  },
});

export const decorationMethods = {
  GET: requestHandle => {
    requestHandle.method = 'get';
    return createRequestHandle(requestHandle);
  },
  POST: requestHandle => {
    requestHandle.method = 'post';
    return createRequestHandle(requestHandle);
  },
  PUT: requestHandle => {
    requestHandle.method = 'put';
    return createRequestHandle(requestHandle);
  },
  DELETE: requestHandle => {
    requestHandle.method = 'delete';
    return createRequestHandle(requestHandle);
  },
};

export const createResponseData = (data = {}, type = 'normal', status?) => {
  const defaultStatus = {
    normal: {
      status: 1,
      message: 'success',
    },
    empty: {
      status: 5,
      message: '查不到数据',
    },
    illegal: {
      status: 4,
      message: '参数错误',
    },
    error: {
      status: 5,
      message: '内部错误',
    },
    refuse: {
      status: 4,
      message: '没有权限',
    },
  };
  return status
    ? { ...defaultStatus[type], ...status, data }
    : {
        ...defaultStatus[type],
        data,
      };
};

// 从请求路径中按"/"截取倒数n个路径，并以/xxx/xxx形式返回
export const getNthLastUrl = (request, n) => {
  const url = request && request.url ? request.url : '';
  const removedParamsUrl = url.split('?')[0].replace(/^\/|\/$/g, '');
  const splitedUrl = removedParamsUrl.split('/');
  const length = splitedUrl.length;
  const result = [];
  for (let count = n; count > 0; count--) {
    const index = length - count;
    if (index < 0) {
      count = length + 1;
      continue;
    }
    result.push(splitedUrl[index]);
  }
  return `/${result.join('/')}`;
};

// 从请求对象里获取信息，此柯里化函数为了减少重复的样板代码
const getInfoFromRequest = (infoType, defaultValue) => request =>
  request && request[infoType] ? request[infoType] : defaultValue;

// 获取完整请求路径
export const getUrl = getInfoFromRequest('url', '');

// 获取请求头
export const getHeaders = getInfoFromRequest('headers', {});

// 获取请求参数
export const getParams = request => {
  if (request.method === 'GET') {
    return request.query || {};
  } else {
    return request.body || {};
  }
};

export const verifyName = name => {
  if (typeof name !== 'string') {
    return false;
  }
  const nameReg = /^[A-Za-z0-9\u4e00-\u9fa5_\-]{1,10}$/;
  return nameReg.test(name);
};

// 密码必须是8位到128位的大小写字母和数字，不能有特殊字符
export const verifyPassword = password => {
  if (typeof password !== 'string') {
    return false;
  }
  const passwordReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,128}$/;
  return passwordReg.test(password);
};
