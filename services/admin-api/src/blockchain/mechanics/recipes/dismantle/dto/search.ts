import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsEnum, IsOptional } from "class-validator";
import { Transform } from "class-transformer";

import { SearchDto } from "@gemunion/collection";
import { DismantleStatus, IDismantleSearchDto } from "@framework/types";

export class DismantleSearchDto extends SearchDto implements IDismantleSearchDto {
  @ApiPropertyOptional({
    enum: DismantleStatus,
    isArray: true,
    // https://github.com/OAI/OpenAPI-Specification/issues/1706
    // format: "deepObject"
  })
  @IsOptional()
  @IsArray({ message: "typeMismatch" })
  @Transform(({ value }) => value as Array<DismantleStatus>)
  @IsEnum(DismantleStatus, { each: true, message: "badInput" })
  public dismantleStatus: Array<DismantleStatus>;

  public templateId: number;
}
