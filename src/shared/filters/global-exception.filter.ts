import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ConflictException,
  ExceptionFilter,
  ForbiddenException,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Response } from 'express';
import { ZodValidationException } from 'nestjs-zod';
import { config } from 'src/config';
import { EntityNotFoundError, QueryFailedError } from 'typeorm';
import { ErrorMessageConstant } from '../constants/message.constant';
import { IErrorResponseWithStatus } from '../interfaces/basic-response.interface';
import { ZodUtils } from '../utils/zod.util';

@Catch()
export class GlobalExceptionHandlerFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionHandlerFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const applicationContext = host.getType();

    if (applicationContext === 'http') {
      // Handle for application context of regular HTTP requests (REST)
      this.httpExceptionResponse(exception as HttpException, host);
      return;
    } else if (applicationContext === 'rpc') {
      // Handle for application context of RPC (Microservice requests)
      //TODO: implement this
    } else if (applicationContext === 'ws') {
      // Handle for application context of WS (Websocket requests)
      //TODO: implement this
    }

    this.logger.error(
      exception,
      exception instanceof Error ? exception.stack : undefined,
    );
  }

  private httpExceptionResponse(
    exception: HttpException,
    host: ArgumentsHost,
  ): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let status = exception.getStatus
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseData = this.httpExceptionResponseData(exception);

    // If responseData has status, override the status
    if (responseData.status) {
      status = responseData.status;
    }

    response.status(status).json(responseData);
  }

  private httpExceptionResponseData(
    exception: HttpException,
  ): IErrorResponseWithStatus {
    const returnDataMap = new Map<string, () => IErrorResponseWithStatus>([
      // Built-in Exception
      [
        UnprocessableEntityException.name,
        (): IErrorResponseWithStatus => {
          return {
            message: ErrorMessageConstant.UnprocessableEntity,
            error: exception.message,
          };
        },
      ],
      [
        UnauthorizedException.name,
        (): IErrorResponseWithStatus => ({
          message: ErrorMessageConstant.Unauthorized,
          error: exception.message,
        }),
      ],
      [
        ForbiddenException.name,
        (): IErrorResponseWithStatus => ({
          message: ErrorMessageConstant.ForbiddenAccess,
          error: exception.message,
        }),
      ],
      [
        NotFoundException.name,
        (): IErrorResponseWithStatus => ({
          message: ErrorMessageConstant.NotFound,
          error: exception.message,
        }),
      ],
      [
        InternalServerErrorException.name,
        (): IErrorResponseWithStatus => ({
          message: ErrorMessageConstant.InternalServerError,
          error: exception.message,
        }),
      ],
      [
        BadRequestException.name,
        (): IErrorResponseWithStatus => ({
          message: ErrorMessageConstant.BadRequest,
          error: exception.message,
        }),
      ],
      [
        ConflictException.name,
        (): IErrorResponseWithStatus => ({
          message: ErrorMessageConstant.Conflict,
          error: exception.message,
        }),
      ],
      // TODO: Custom Exception
      // [
      //     DataNotFoundException.name,
      //     (): IErrorResponseWithStatus => ({
      //         message: ERROR_MESSAGE_CONSTANT.DataNotFound,
      //         error: exception.message,
      //     }),
      // ],
      // Zod Validation Error
      [
        ZodValidationException.name,
        (): IErrorResponseWithStatus => {
          const zodValidationException = exception as ZodValidationException;
          const zodValidationResponseFormat =
            ZodUtils.zodValidationResponseFormat(zodValidationException);

          return {
            message: ErrorMessageConstant.ValidationError,
            errors: zodValidationResponseFormat,
          };
        },
      ],
      // TypeORM Error
      [
        EntityNotFoundError.name,
        (): IErrorResponseWithStatus => {
          const match = exception.message.match(/entity of type "(.+?)"/);
          const entity = match?.[1] ?? 'Resource';
          const message = `${entity} not found.`;

          return {
            message: ErrorMessageConstant.NotFound,
            error: message,
            status: HttpStatus.NOT_FOUND,
          };
        },
      ],
      [
        QueryFailedError.name,
        (): IErrorResponseWithStatus => {
          return {
            message: ErrorMessageConstant.QueryError,
            error:
              config.nodeEnv == 'development'
                ? exception.message
                : ErrorMessageConstant.QueryError,
          };
        },
      ],
    ]);

    const returnData = returnDataMap.get(exception.constructor.name);
    if (returnData) {
      return returnData();
    }

    // Capture for unhandled exception type
    this.logger.error(exception);

    return {
      message: ErrorMessageConstant.InternalServerError,
      error: exception.message || ErrorMessageConstant.InternalServerError,
    };
  }
}
