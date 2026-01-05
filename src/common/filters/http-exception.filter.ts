import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const exceptionResponse = exception.getResponse();
    const errors = typeof exceptionResponse === 'object' && 'message' in exceptionResponse
      ? Array.isArray(exceptionResponse['message'])
        ? exceptionResponse['message']
        : [exceptionResponse['message']]
      : [exception.message];

    response.status(status).json({
      success: false,
      request: request.url,
      method: request.method.toUpperCase(),
      code: status,
      data: null,
      errors: errors.map(error => ({
        message: error,
        code: status,
      })),
    });
  }
}

