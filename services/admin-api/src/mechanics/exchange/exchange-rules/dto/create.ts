import { ApiProperty } from "@nestjs/swagger";
import { ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { IExchangeRuleCreateDto } from "../interfaces";
import { AssetDto } from "../../../asset/dto";

export class ExchangeCreateDto implements IExchangeRuleCreateDto {
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
