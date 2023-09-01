import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsInt, Min, IsOptional } from "class-validator";
import { Type } from "class-transformer";

import { SearchDto } from "@gemunion/collection";
import type { CraftStatus, ICraftSearchDto } from "@framework/types";

export class CraftSearchDto extends SearchDto implements ICraftSearchDto {
  @ApiPropertyOptional({
    minimum: 1,
  })
  @IsOptional()
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  @Type(() => Number)
  public templateId: number;

  public craftStatus: Array<CraftStatus>;
}
