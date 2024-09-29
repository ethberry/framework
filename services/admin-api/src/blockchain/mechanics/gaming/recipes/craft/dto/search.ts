import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsEnum, IsOptional } from "class-validator";
import { Transform } from "class-transformer";

import { SearchDto } from "@ethberry/collection";
import { CraftStatus } from "@framework/types";
import type { ICraftSearchDto } from "@framework/types";

export class CraftSearchDto extends SearchDto implements ICraftSearchDto {
  @ApiPropertyOptional({
    enum: CraftStatus,
    isArray: true,
    // https://github.com/OAI/OpenAPI-Specification/issues/1706
    // format: "deepObject"
  })
  @IsOptional()
  @IsArray({ message: "typeMismatch" })
  @Transform(({ value }) => value as Array<CraftStatus>)
  @IsEnum(CraftStatus, { each: true, message: "badInput" })
  public craftStatus: Array<CraftStatus>;

  public templateId: number;
  public contractId: number;
}
