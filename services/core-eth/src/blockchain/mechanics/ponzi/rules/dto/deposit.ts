import { ApiProperty } from "@nestjs/swagger";
import { ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { IAssetDto } from "@framework/types";

import { DepositComponentDto } from "./deposit-components";

export class DepositDto implements IAssetDto {
  @ApiProperty({
    type: DepositComponentDto,
    isArray: true,
  })
  @ValidateNested({ each: true })
  @Type(() => DepositComponentDto)
  public components: Array<DepositComponentDto>;
}
