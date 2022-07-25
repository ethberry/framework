import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsInt, IsString, IsUrl, Max, MaxLength, Min } from "class-validator";
import { Transform } from "class-transformer";

import { Erc1155ContractTemplate, IErc1155ContractDeployDto } from "@framework/types";

export class Erc1155ContractDeployDto implements IErc1155ContractDeployDto {
  @ApiProperty({
    enum: Erc1155ContractTemplate,
  })
  @Transform(({ value }) => value as Erc1155ContractTemplate)
  @IsEnum(Erc1155ContractTemplate, { message: "badInput" })
  public contractTemplate: Erc1155ContractTemplate;

  @ApiProperty()
  @IsInt({ message: "typeMismatch" })
  @Min(0, { message: "rangeUnderflow" })
  @Max(1000, { message: "rangeOverflow" })
  public royalty: number;

  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  @MaxLength(128, { message: "rangeOverflow" })
  @IsUrl({ require_tld: false }, { message: "patternMismatch" })
  public baseTokenURI: string;
}
