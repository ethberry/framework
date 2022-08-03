import { ApiProperty } from "@nestjs/swagger";
import { IsJSON, IsString, IsUrl, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { IMysteryboxCreateDto } from "../interfaces";
import { AssetDto } from "../../asset/dto";

export class MysteryboxCreateDto implements IMysteryboxCreateDto {
  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  public title: string;

  @ApiProperty()
  @IsJSON({ message: "patternMismatch" })
  public description: string;

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
  public price: AssetDto;

  @ApiProperty()
  @IsUrl({}, { message: "patternMismatch" })
  @IsString({ message: "typeMismatch" })
  public imageUrl: string;
}
