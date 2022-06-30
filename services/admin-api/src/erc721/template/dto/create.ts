import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsJSON, IsString, IsUrl, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { IsBigNumber } from "@gemunion/nest-js-validators";

import { IErc721TemplateCreateDto } from "../interfaces";
import { AssetDto } from "../../../blockchain/asset/dto";

export class Erc721TemplateCreateDto implements IErc721TemplateCreateDto {
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
    minimum: 0,
  })
  @IsBigNumber({ minimum: "0" }, { message: "typeMismatch" })
  public amount: string;

  @ApiProperty()
  @IsUrl({}, { message: "patternMismatch" })
  @IsString({ message: "typeMismatch" })
  public imageUrl: string;

  @ApiProperty({
    minimum: 1,
  })
  @IsInt({ message: "typeMismatch" })
  public uniContractId: number;
}
