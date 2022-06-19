import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsJSON, IsNumberString, IsString, IsUrl, Min } from "class-validator";

import { IErc998TemplateCreateDto } from "../interfaces";

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

  @ApiProperty()
  @IsNumberString({}, { message: "typeMismatch" })
  public price: string;

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
