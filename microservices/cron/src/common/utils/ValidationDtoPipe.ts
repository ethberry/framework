import { BadRequestException, ValidationPipe } from "@nestjs/common";

export const ValidationDtoPipe = new ValidationPipe({
  exceptionFactory: errors => {
    const errorMessages = errors.map(err => {
      return {
        field: err.property,
        error: err.constraints,
        value: err.value,
      };
    });

    return new BadRequestException({
      message: `Bad Request Exception: ${JSON.stringify(errorMessages, null, "\t")}`,
      errors,
    });
  },
});