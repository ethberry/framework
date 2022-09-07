import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsEnum, IsInt, IsString, IsUrl, Max, MaxLength, Min } from "class-validator";
import { Transform } from "class-transformer";

import type { IErc1155ContractDeployDto } from "@framework/types";
import { Erc1155ContractFeatures } from "@framework/types";

export class Erc1155ContractDeployDto implements IErc1155ContractDeployDto {
  @ApiProperty({
    enum: Erc1155ContractFeatures,
    isArray: true,
  })
  @IsArray({ message: "typeMismatch" })
  @Transform(({ value }) => value as Array<Erc1155ContractFeatures>)
  @IsEnum(Erc1155ContractFeatures, { each: true, message: "badInput" })
  public contractFeatures: Array<Erc1155ContractFeatures>;

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
