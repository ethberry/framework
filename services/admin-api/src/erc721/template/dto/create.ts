import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsJSON, IsNumberString, IsString, IsUrl } from "class-validator";

import { IErc721TemplateCreateDto } from "../interfaces";

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

  @ApiProperty()
  @IsNumberString({}, { message: "typeMismatch" })
  public price: string;

  @ApiProperty()
  @IsUrl({}, { message: "patternMismatch" })
  @IsString({ message: "typeMismatch" })
  public imageUrl: string;

  @ApiProperty({
    minimum: 1,
  })
  @IsInt({ message: "typeMismatch" })
  public erc721CollectionId: number;
}
