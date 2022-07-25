import { ApiProperty } from "@nestjs/swagger";
import { ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { ICraftCreateDto } from "../interfaces";
import { AssetDto } from "../../asset/dto";

export class ExchangeCreateDto implements ICraftCreateDto {
  @ApiProperty({
    type: AssetDto,
  })
  @ValidateNested()
  @Type(() => AssetDto)
  public item: AssetDto;

  @ApiProperty({
    type: AssetDto,
  })
  @ValidateNested()
  @Type(() => AssetDto)
  public ingredients: AssetDto;
}
