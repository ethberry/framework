import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsJSON, IsString, IsUrl, Min, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { IsBigNumber } from "@gemunion/nest-js-validators";

import { IErc1155TemplateCreateDto } from "../interfaces";
import { AssetDto } from "../../../blockchain/asset/dto";

export class Erc1155TokenCreateDto implements IErc1155TemplateCreateDto {
  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  public title: string;

  @ApiProperty()
  @IsJSON({ message: "patternMismatch" })
  public description: string;

  @ApiProperty()
  @IsJSON({ message: "patternMismatch" })
  public attributes: string;

  @ApiProperty({
    type: AssetDto,
  })
  @ValidateNested()
  @Type(() => AssetDto)
  public price: AssetDto;

  @ApiProperty({
    type: Number,
    minimum: 1,
  })
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public erc20TokenId: number;

  @ApiProperty({
    minimum: 0,
  })
  @IsBigNumber({ minimum: "0" }, { message: "typeMismatch" })
  public amount: string;

  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  @IsUrl({}, { message: "patternMismatch" })
  public imageUrl: string;

  @ApiProperty({
    type: Number,
    minimum: 1,
  })
  @IsInt({ each: true, message: "typeMismatch" })
  @Min(1, { each: true, message: "rangeUnderflow" })
  public erc1155CollectionId: number;
}
