import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsString, MaxLength, Validate } from "class-validator";

import { ForbidEnumValues, IsBigNumber } from "@gemunion/nest-js-validators";
import { Erc20ContractTemplate, IErc20TokenDeployDto } from "@framework/types";

export class Erc20TokenDeployDto implements IErc20TokenDeployDto {
  @ApiProperty({
    enum: Erc20ContractTemplate,
  })
  @IsEnum(Erc20ContractTemplate, { message: "badInput" })
  @Validate(ForbidEnumValues, [Erc20ContractTemplate.EXTERNAL, Erc20ContractTemplate.NATIVE])
  public contractTemplate: Erc20ContractTemplate;

  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  @MaxLength(32, { message: "rangeOverflow" })
  public name: string;

  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  @MaxLength(5, { message: "rangeOverflow" })
  public symbol: string;

  @ApiProperty({
    type: Number,
  })
  @IsBigNumber({}, { message: "typeMismatch" })
  public cap: string;
}
