import { ApiProperty } from "@nestjs/swagger";
import { IsEthereumAddress, IsInt, IsString, Min, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { IErc721AirdropCreateDto, IErc721AirdropItem } from "../interfaces";

export class Erc721AirdropItem implements IErc721AirdropItem {
  @ApiProperty()
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public erc721TemplateId: number;

  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  @IsEthereumAddress({ message: "patternMismatch" })
  public owner: string;
}

export class Erc721AirdropCreateDto implements IErc721AirdropCreateDto {
  @ApiProperty({
    type: Erc721AirdropItem,
    isArray: true,
  })
  @ValidateNested({ each: true })
  @Type(() => Erc721AirdropItem)
  public list: Array<IErc721AirdropItem>;
}
