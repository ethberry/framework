import { ApiProperty } from "@nestjs/swagger";
import { IsJSON, IsString, IsUrl } from "class-validator";

import { IErc1155CollectionCreateDto } from "../interfaces";

export class Erc1155CollectionCreateDto implements IErc1155CollectionCreateDto {
  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  public title: string;

  @ApiProperty()
  @IsJSON({ message: "patternMismatch" })
  public description: string;

  @ApiProperty()
  @IsUrl({}, { message: "patternMismatch" })
  @IsString({ message: "typeMismatch" })
  public imageUrl: string;
}
