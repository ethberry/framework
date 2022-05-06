import { ApiProperty } from "@nestjs/swagger";
import { IsJSON, IsString, IsUrl } from "class-validator";

import { IErc721CollectionCreateDto } from "../interfaces";

export class Erc721CollectionCreateDto implements IErc721CollectionCreateDto {
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
