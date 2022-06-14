import { ApiProperty } from "@nestjs/swagger";
import { IsInt, Min } from "class-validator";

import { ISignTemplateDto } from "../interfaces";

export class SignTemplateDto implements ISignTemplateDto {
  @ApiProperty({
    minimum: 1,
  })
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public templateId: number;
}
