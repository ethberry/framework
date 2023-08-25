import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsOptional } from "class-validator";
import { Transform } from "class-transformer";

import { SearchDto } from "@gemunion/collection";
import { CraftStatus, ICraftSearchDto } from "@framework/types";

export class CraftSearchDto extends SearchDto implements ICraftSearchDto {
  @ApiPropertyOptional()
  @IsOptional()
  // https://github.com/typestack/class-transformer/issues/626
  @Transform(({ value }) => {
    return [true, "true"].includes(value);
  })
  @IsBoolean({ message: "typeMismatch" })
  public inverse: boolean;

  public craftStatus: Array<CraftStatus>;
}
