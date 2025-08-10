import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let res =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    let message: string | string[];

    if (typeof res === 'string') {
      message = res;
    } else if (typeof res === 'object' && res !== null) {
      if (Array.isArray((res as any).message)) {
        message = (res as any).message;
      } else if ((res as any).message) {
        message = (res as any).message;
      } else {
        message = JSON.stringify(res);
      }
    } else {
      message = 'Internal server error';
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}