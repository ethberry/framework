import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsString, MaxLength, Validate } from "class-validator";

import { ForbidEnumValues, IsBigNumber } from "@gemunion/nest-js-validators";
import { Erc20TokenTemplate, IErc20TokenDeployDto } from "@framework/types";

export class Erc20TokenDeployDto implements IErc20TokenDeployDto {
  @ApiProperty({
    enum: Erc20TokenTemplate,
  })
  @IsEnum(Erc20TokenTemplate, { message: "badInput" })
  @Validate(ForbidEnumValues, [Erc20TokenTemplate.EXTERNAL, Erc20TokenTemplate.NATIVE])
  public contractTemplate: Erc20TokenTemplate;

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
