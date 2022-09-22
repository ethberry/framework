import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsInt, IsOptional, Min } from "class-validator";
import { Mixin } from "ts-mixer";

import { AccountOptionalDto, PaginationDto } from "@gemunion/collection";
import { IWaitlistItemSearchDto } from "@framework/types";

export class WaitlistSearchDto extends Mixin(AccountOptionalDto, PaginationDto) implements IWaitlistItemSearchDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public listId: number;
}
