import { ApiProperty } from "@nestjs/swagger";
import { ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { NftDto, PriceDto } from "../../../../exchange/asset/dto";
import type { IDismantleCreateDto } from "../interfaces";

export class DismantleCreateDto implements IDismantleCreateDto {
  @ApiProperty({
    type: PriceDto,
  })
  @ValidateNested()
  @Type(() => PriceDto)
  public item: PriceDto;

  @ApiProperty({
    type: NftDto,
  })
  @ValidateNested()
  @Type(() => NftDto)
  public price: NftDto;
}
