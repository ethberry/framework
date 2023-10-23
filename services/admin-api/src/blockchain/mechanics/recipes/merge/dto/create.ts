import { ApiProperty } from "@nestjs/swagger";
import { ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import type { IMergeCreateDto } from "../interfaces";
import { NftDto } from "../../../../exchange/asset/dto/custom";

export class MergeCreateDto implements IMergeCreateDto {
  @ApiProperty({
    type: NftDto,
  })
  @ValidateNested()
  @Type(() => NftDto)
  public item: InstanceType<typeof NftDto>;

  @ApiProperty({
    type: NftDto,
  })
  @ValidateNested()
  @Type(() => NftDto)
  public price: InstanceType<typeof NftDto>;
}
