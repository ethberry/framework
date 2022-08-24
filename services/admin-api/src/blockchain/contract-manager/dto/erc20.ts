import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsEnum, IsString, MaxLength } from "class-validator";
import { Transform } from "class-transformer";

import { IsBigNumber } from "@gemunion/nest-js-validators";
import type { IErc20TokenDeployDto } from "@framework/types";
import { Erc20ContractFeatures } from "@framework/types";

export class Erc20ContractDeployDto implements IErc20TokenDeployDto {
  @ApiProperty({
    enum: Erc20ContractFeatures,
    isArray: true,
  })
  @IsArray({ message: "typeMismatch" })
  @Transform(({ value }) => value as Array<Erc20ContractFeatures>)
  @IsEnum(Erc20ContractFeatures, { each: true, message: "badInput" })
  public contractFeatures: Array<Erc20ContractFeatures>;

  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  @MaxLength(32, { message: "rangeOverflow" })
  public name: string;

  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  @MaxLength(32, { message: "rangeOverflow" })
  public symbol: string;

  @ApiProperty({
    type: Number,
  })
  @IsBigNumber({}, { message: "typeMismatch" })
  public cap: string;
}
