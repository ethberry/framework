import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";
import { decorate } from "ts-mixer";

import { IParamsDto } from "../interfaces/params";

export class ParamsDto implements IParamsDto {
  @decorate(
    ApiPropertyOptional({
      type: String,
    }),
  )
  @decorate(IsOptional())
  @decorate(IsString({ message: "typeMismatch" }))
  public parameterName: string;

  @decorate(
    ApiPropertyOptional({
      type: String,
    }),
  )
  @decorate(IsOptional())
  @decorate(IsString({ message: "typeMismatch" }))
  public parameterValue: string;
}
