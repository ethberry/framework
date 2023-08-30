import { ApiProperty } from "@nestjs/swagger";
import { ValidateNested, IsInt, Min } from "class-validator";
import { Type } from "class-transformer";

import { NftDto, PriceDto } from "../../../../exchange/asset/dto";
import type { IDismantleCreateDto } from "../interfaces";

export class DismantleCreateDto implements IDismantleCreateDto {
  @ApiProperty({
    type: NftDto,
  })
  @ValidateNested()
  @Type(() => NftDto)
  public item: NftDto;

  @ApiProperty({
    type: PriceDto,
  })
  @ValidateNested()
  @Type(() => PriceDto)
  public price: PriceDto;

  @ApiProperty()
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  // unfortunately there is no such property, so we just save
  // @ValidateIf(o => o.item.components[0].contract.contractFeatures.includes(ContractFeatures.RANDOM))
  public rarityMultiplier: number;
}
