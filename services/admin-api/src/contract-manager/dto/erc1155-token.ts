import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsString, IsUrl, MaxLength } from "class-validator";

import { Erc1155TokenTemplate, IErc1155TokenDeployDto } from "@framework/types";

export class Erc1155TokenDeployDto implements IErc1155TokenDeployDto {
  @ApiProperty({
    enum: Erc1155TokenTemplate,
  })
  @IsEnum(Erc1155TokenTemplate, { message: "badInput" })
  public contractTemplate: Erc1155TokenTemplate;

  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  @MaxLength(32, { message: "rangeOverflow" })
  @IsUrl({}, { message: "patternMismatch" })
  public baseTokenURI: string;
}
