import { ApiProperty } from "@nestjs/swagger";
import { IsInt, Min } from "class-validator";
import { Type } from "class-transformer";

import { SearchDto } from "@gemunion/collection";
import type { DismantleStatus, IDismantleSearchDto } from "@framework/types";

export class DismantleSearchDto extends SearchDto implements IDismantleSearchDto {
  @ApiProperty({
    minimum: 1,
  })
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  @Type(() => Number)
  public templateId: number;

  public dismantleStatus: Array<DismantleStatus>;
}
