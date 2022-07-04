import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsInt, IsString, IsUrl, Max, MaxLength, Min } from "class-validator";
import { Transform } from "class-transformer";

import { Erc998ContractTemplate, IErc998ContractDeployDto } from "@framework/types";

export class Erc998TokenDeployDto implements IErc998ContractDeployDto {
  @ApiProperty({
    enum: Erc998ContractTemplate,
  })
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  @Transform(({ value }) => value as Erc998ContractTemplate)
  @IsEnum(Erc998ContractTemplate, { message: "badInput" })
  public contractTemplate: Erc998ContractTemplate;

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
  @MaxLength(128, { message: "rangeOverflow" })
  @IsUrl({ require_tld: false }, { message: "patternMismatch" })
  public baseTokenURI: string;

  @ApiProperty()
  @IsInt({ message: "typeMismatch" })
  @Min(0, { message: "rangeUnderflow" })
  @Max(1000, { message: "rangeOverflow" })
  public royalty: number;
}
