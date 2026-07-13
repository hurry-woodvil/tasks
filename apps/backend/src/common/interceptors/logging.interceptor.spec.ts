import { CallHandler, ExecutionContext, Logger } from '@nestjs/common';
import { LoggingIntercepter } from './logging.interceptor';
import { lastValueFrom, of } from 'rxjs';

describe('LoggingInterceptor', () => {
  let interceptor: LoggingIntercepter;

  beforeEach(() => {
    interceptor = new LoggingIntercepter();
  });

  it('passes through the response', async () => {
    jest.spyOn(Logger.prototype, 'log').mockImplementation();

    const request = {
      method: 'GET',
      originalUrl: '/tasks',
    };

    const response = {
      statusCode: 200,
    };

    const context = {
      switchToHttp: () => ({
        getRequest: () => request,
        getResponse: () => response,
      }),
    } as unknown as ExecutionContext;

    const next = {
      handle: () => of({ result: 'ok' }),
    } as CallHandler;

    await expect(
      lastValueFrom(interceptor.intercept(context, next)),
    ).resolves.toEqual({ result: 'ok' });
  });
});
