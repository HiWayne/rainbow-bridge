import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface Response<T> {
  status: number;
  data: T;
  message: string;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map(response => {
        if (
          Object.prototype.toString.call(response) === '[object Object]' &&
          (response.status !== undefined || response.message !== undefined)
        ) {
          const { status = 1, message = '', ...data } = response;
          return {
            status,
            data,
            message,
          };
        } else {
          return {
            status: 1,
            data: response,
            message: '',
          };
        }
      }),
    );
  }
}
