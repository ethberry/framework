import { ApiProperty } from "@nestjs/swagger";
import { ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { IAssetDto } from "@framework/types";

import { RewardComponentDto } from "./reward-components";

export class RewardDto implements IAssetDto {
  @ApiProperty({
    type: RewardComponentDto,
    isArray: true,
  })
  @ValidateNested({ each: true })
  @Type(() => RewardComponentDto)
  public components: Array<RewardComponentDto>;
}
