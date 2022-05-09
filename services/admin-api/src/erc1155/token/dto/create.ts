import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsJSON, IsNumberString, IsString, IsUrl, Min } from "class-validator";

import { IErc1155TokenCreateDto } from "../interfaces";

export class Erc1155TokenCreateDto implements IErc1155TokenCreateDto {
  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  public title: string;

  @ApiProperty()
  @IsJSON({ message: "patternMismatch" })
  public description: string;

  @ApiProperty()
  @IsJSON({ message: "patternMismatch" })
  public attributes: string;

  @ApiProperty()
  @IsNumberString({}, { message: "typeMismatch" })
  public price: string;

  @ApiProperty({
    minimum: 1,
  })
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public amount: number;

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
