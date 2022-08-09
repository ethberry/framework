import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsEnum, IsInt, IsString, IsUrl, Max, MaxLength, Min } from "class-validator";
import { Transform } from "class-transformer";

import { Erc998ContractFeatures, IErc998ContractDeployDto } from "@framework/types";

export class Erc998ContractDeployDto implements IErc998ContractDeployDto {
  @ApiProperty({
    enum: Erc998ContractFeatures,
    isArray: true,
  })
  @IsArray({ message: "typeMismatch" })
  @Transform(({ value }) => value as Array<Erc998ContractFeatures>)
  @IsEnum(Erc998ContractFeatures, { each: true, message: "badInput" })
  public contractFeatures: Array<Erc998ContractFeatures>;

  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  @MaxLength(32, { message: "rangeOverflow" })
  public name: string;

  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  @MaxLength(5, { message: "rangeOverflow" })
  public symbol: string;

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
