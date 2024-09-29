import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsEnum, IsOptional } from "class-validator";
import { Transform } from "class-transformer";

import { SearchDto } from "@ethberry/collection";
import type { IMergeSearchDto } from "@framework/types";
import { MergeStatus } from "@framework/types";

export class MergeSearchDto extends SearchDto implements IMergeSearchDto {
  @ApiPropertyOptional({
    enum: MergeStatus,
    isArray: true,
    // https://github.com/OAI/OpenAPI-Specification/issues/1706
    // format: "deepObject"
  })
  @IsOptional()
  @IsArray({ message: "typeMismatch" })
  @Transform(({ value }) => value as Array<MergeStatus>)
  @IsEnum(MergeStatus, { each: true, message: "badInput" })
  public mergeStatus: Array<MergeStatus>;

  public templateId: number;
  public contractId: number;
}
