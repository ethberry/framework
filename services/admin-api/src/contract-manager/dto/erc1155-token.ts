import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsString, IsUrl, MaxLength } from "class-validator";
import { Transform } from "class-transformer";

import { Erc1155TokenTemplate, IErc1155TokenDeployDto } from "@framework/types";

export class Erc1155TokenDeployDto implements IErc1155TokenDeployDto {
  @ApiProperty({
    enum: Erc1155TokenTemplate,
  })
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  @Transform(({ value }) => value as Erc1155TokenTemplate)
  @IsEnum(Erc1155TokenTemplate, { message: "badInput" })
  public contractTemplate: Erc1155TokenTemplate;

  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  @MaxLength(128, { message: "rangeOverflow" }) // todo probably remove length check
  @IsUrl({ require_tld: false }, { message: "patternMismatch" })
  public baseTokenURI: string;
}
