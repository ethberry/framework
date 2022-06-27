import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsInt, IsString, IsUrl, Max, MaxLength, Min } from "class-validator";
import { Transform } from "class-transformer";

import { Erc721ContractTemplate, IErc721ContractDeployDto } from "@framework/types";

export class Erc721TokenDeployDto implements IErc721ContractDeployDto {
  @ApiProperty({
    enum: Erc721ContractTemplate,
  })
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  @Transform(({ value }) => value as Erc721ContractTemplate)
  @IsEnum(Erc721ContractTemplate, { message: "badInput" })
  public contractTemplate: Erc721ContractTemplate;

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
