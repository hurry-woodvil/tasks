import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingIntercepter implements NestInterceptor {
  private readonly logger = new Logger(LoggingIntercepter.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    const method = request.method;
    const path = request.originalUrl;
    const startedAt = Date.now();

    this.logger.log(`Request ${method} ${path}`);

    return next.handle().pipe(
      tap(() => {
        const durationMs = Date.now() - startedAt;

        this.logger.log(
          `Response ${method} ${path} ${response.statusCode} ${durationMs}ms`,
        );
      }),
    );
  }
}
