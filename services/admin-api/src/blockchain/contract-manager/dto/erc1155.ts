import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsString, IsUrl, MaxLength } from "class-validator";
import { Transform } from "class-transformer";

import { Erc1155ContractTemplate, IContractDeployDto } from "@framework/types";

export class Erc1155ContractDeployDto implements IContractDeployDto {
  @ApiProperty({
    enum: Erc1155ContractTemplate,
  })
  @Transform(({ value }) => value as Erc1155ContractTemplate)
  @IsEnum(Erc1155ContractTemplate, { message: "badInput" })
  public contractTemplate: Erc1155ContractTemplate;

  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  @MaxLength(128, { message: "rangeOverflow" })
  @IsUrl({ require_tld: false }, { message: "patternMismatch" })
  public baseTokenURI: string;
}
