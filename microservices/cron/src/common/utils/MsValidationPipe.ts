import {
  BadRequestException,
  Injectable,
  ValidationError,
  ValidationPipe,
  ValidationPipeOptions,
} from "@nestjs/common";

@Injectable()
export class MsValidationPipe extends ValidationPipe {
  constructor(options?: ValidationPipeOptions) {
    super({
      exceptionFactory: (errors: Array<ValidationError>): BadRequestException => new BadRequestException(errors),
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      ...options,
    });
  }
}
