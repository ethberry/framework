import { ApiProperty } from "@nestjs/swagger";
import { IsISO8601, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { Mixin } from "ts-mixer";

import { AccountDto } from "@gemunion/collection";
import type { IClaimCreateDto } from "@framework/types";

import { ItemDto } from "../../../exchange/asset/dto";
import { ChainIdDto } from "../../../../common/dto";

export class ClaimItemCreateDto extends Mixin(AccountDto, ChainIdDto) implements IClaimCreateDto {
  @ApiProperty({
    type: ItemDto,
  })
  @ValidateNested()
  @Type(() => ItemDto)
  public item: ItemDto;

  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  @IsISO8601({}, { message: "patternMismatch" })
  public endTimestamp: string;
}
