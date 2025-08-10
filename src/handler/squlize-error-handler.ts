import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { UniqueConstraintError, ValidationError } from 'sequelize';

@Catch()
export class SequelizeExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    if (exception instanceof UniqueConstraintError) {
        const field = Object.keys(exception.fields)[0];
        const value = exception.fields[field];
        return response
            .status(409)
            .json({  message: `${field} ${value} already exists`});
    }

    if (exception instanceof ValidationError) {
      return response.status(400).json({ message: exception.errors.map(e => e.message) });
    }

    return response.status(500).json({ message: 'Internal server error' });
  }
}