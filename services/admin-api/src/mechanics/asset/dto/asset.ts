import { ApiProperty } from "@nestjs/swagger";
import { ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { IAssetDto } from "../interfaces";
import { AssetComponentDto } from "./components";

export class AssetDto implements IAssetDto {
  @ApiProperty({
    type: AssetComponentDto,
    isArray: true,
  })
  @ValidateNested({ each: true })
  @Type(() => AssetComponentDto)
  public components: Array<AssetComponentDto>;
}
