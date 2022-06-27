import { ApiProperty } from "@nestjs/swagger";
import { IsEthereumAddress, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { IAirdropCreateDto, IAirdropItem } from "../interfaces";
import { AssetDto } from "../../../uni-token/dto";

export class AirdropItem implements IAirdropItem {
  @ApiProperty({
    type: AssetDto,
  })
  @ValidateNested()
  @Type(() => AssetDto)
  public item: AssetDto;

  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  @IsEthereumAddress({ message: "patternMismatch" })
  public account: string;
}

export class Erc998AirdropCreateDto implements IAirdropCreateDto {
  @ApiProperty({
    type: AirdropItem,
    isArray: true,
  })
  @ValidateNested({ each: true })
  @Type(() => AirdropItem)
  public list: Array<AirdropItem>;
}
