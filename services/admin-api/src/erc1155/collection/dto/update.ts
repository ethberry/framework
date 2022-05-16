import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsJSON, IsOptional, IsString, IsUrl } from "class-validator";

import { IErc1155CollectionUpdateDto } from "../interfaces";

export class Erc1155CollectionUpdateDto implements IErc1155CollectionUpdateDto {
  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  public title: string;

  @ApiProperty()
  @IsJSON({ message: "patternMismatch" })
  public description: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl({}, { message: "patternMismatch" })
  @IsString({ message: "typeMismatch" })
  public imageUrl: string;
}
