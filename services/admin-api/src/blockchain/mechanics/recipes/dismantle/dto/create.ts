import { ApiProperty } from "@nestjs/swagger";
import { ValidateNested, IsInt, Min } from "class-validator";
import { Type } from "class-transformer";

import type { IDismantleCreateDto } from "../interfaces";
import { DismantleItemDto, DismantlePriceDto } from "./custom";

export class DismantleCreateDto implements IDismantleCreateDto {
  @ApiProperty({
    type: DismantleItemDto,
  })
  @ValidateNested()
  @Type(() => DismantleItemDto)
  public item: InstanceType<typeof DismantleItemDto>;

  @ApiProperty({
    type: DismantlePriceDto,
  })
  @ValidateNested()
  @Type(() => DismantlePriceDto)
  public price: InstanceType<typeof DismantlePriceDto>;

  @ApiProperty()
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  // unfortunately there is no such property, so we just save
  // @ValidateIf(o => o.item.components[0].contract.contractFeatures.includes(ContractFeatures.RANDOM))
  public rarityMultiplier: number;
}
