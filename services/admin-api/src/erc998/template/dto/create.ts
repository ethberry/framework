import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsJSON, ValidateNested, IsString, IsUrl, Min } from "class-validator";
import { Type } from "class-transformer";

import { IErc998TemplateCreateDto } from "../interfaces";
import { AssetDto } from "../../../uni-token/dto";

export class Erc998TemplateCreateDto implements IErc998TemplateCreateDto {
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
  @IsInt({ message: "typeMismatch" })
  @Min(0, { message: "rangeUnderflow" })
  public amount: number;

  @ApiProperty()
  @IsUrl({}, { message: "patternMismatch" })
  @IsString({ message: "typeMismatch" })
  public imageUrl: string;

  @ApiProperty({
    minimum: 1,
  })
  @IsInt({ message: "typeMismatch" })
  public erc998CollectionId: number;
}
