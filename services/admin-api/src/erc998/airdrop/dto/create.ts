import { ApiProperty } from "@nestjs/swagger";
import { IsEthereumAddress, IsInt, IsString, Min, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { IErc998AirdropCreateDto, IErc998AirdropItem } from "../interfaces";

export class Erc998AirdropItem implements IErc998AirdropItem {
  @ApiProperty()
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public erc998TemplateId: number;

  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  @IsEthereumAddress({ message: "patternMismatch" })
  public owner: string;
}

export class Erc998AirdropCreateDto implements IErc998AirdropCreateDto {
  @ApiProperty({
    type: Erc998AirdropItem,
    isArray: true,
  })
  @ValidateNested({ each: true })
  @Type(() => Erc998AirdropItem)
  public list: Array<IErc998AirdropItem>;
}
