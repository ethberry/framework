import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsInt, IsString, IsUrl, Max, MaxLength } from "class-validator";

import { Erc721TokenTemplate, IErc721TokenDeployDto } from "@framework/types";

export class Erc721TokenDeployDto implements IErc721TokenDeployDto {
  @ApiProperty({
    enum: Erc721TokenTemplate,
  })
  @IsEnum(Erc721TokenTemplate, { message: "badInput" })
  public contractTemplate: Erc721TokenTemplate;

  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  @MaxLength(32, { message: "rangeOverflow" })
  public name: string;

  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  @MaxLength(5, { message: "rangeOverflow" })
  public symbol: string;

  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  @MaxLength(32, { message: "rangeOverflow" })
  @IsUrl({}, { message: "patternMismatch" })
  public baseTokenURI: string;

  @ApiProperty()
  @IsInt({ message: "typeMismatch" })
  @Max(10000, { message: "rangeOverflow" })
  public royalty: number;
}
