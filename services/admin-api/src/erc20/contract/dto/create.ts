import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsEthereumAddress, IsInt, IsJSON, IsString, MaxLength, Min, Validate } from "class-validator";

import { ForbidEnumValues } from "@gemunion/nest-js-validators";
import { Erc20ContractTemplate, IErc20TokenCreateDto } from "@framework/types";

export class Erc20TokenCreateDto implements IErc20TokenCreateDto {
  @ApiProperty({
    enum: Erc20ContractTemplate,
  })
  @IsEnum(Erc20ContractTemplate, { message: "badInput" })
  @Validate(ForbidEnumValues, [Erc20ContractTemplate.SIMPLE, Erc20ContractTemplate.BLACKLIST])
  public contractTemplate: Erc20ContractTemplate;

  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  @MaxLength(5, { message: "rangeOverflow" })
  public symbol: string;

  @ApiProperty()
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public decimals: number;

  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  public title: string;

  @ApiProperty()
  @IsJSON({ message: "patternMismatch" })
  public description: string;

  @ApiProperty()
  @IsEthereumAddress({ message: "patternMismatch" })
  public address: string;
}
