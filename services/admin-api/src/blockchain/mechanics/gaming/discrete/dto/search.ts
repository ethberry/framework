import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsEnum, IsOptional } from "class-validator";
import { Transform } from "class-transformer";

import { SearchDto } from "@ethberry/collection";
import type { IDiscreteSearchDto } from "@framework/types";
import { DiscreteStatus } from "@framework/types";

export class DiscreteSearchDto extends SearchDto implements IDiscreteSearchDto {
  @ApiPropertyOptional({
    enum: DiscreteStatus,
    isArray: true,
    // https://github.com/OAI/OpenAPI-Specification/issues/1706
    // format: "deepObject"
  })
  @IsOptional()
  @IsArray({ message: "typeMismatch" })
  @Transform(({ value }) => value as Array<DiscreteStatus>)
  @IsEnum(DiscreteStatus, { each: true, message: "badInput" })
  public discreteStatus: Array<DiscreteStatus>;

  public merchantId: number;
}
