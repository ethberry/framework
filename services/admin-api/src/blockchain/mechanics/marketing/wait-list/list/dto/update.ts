import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsOptional } from "class-validator";

import { SearchableOptionalDto } from "@gemunion/collection";
import type { IWaitListListUpdateDto } from "@framework/types";

export class WaitListListUpdateDto extends SearchableOptionalDto implements IWaitListListUpdateDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean({ message: "typeMismatch" })
  public isPrivate: boolean;
}
