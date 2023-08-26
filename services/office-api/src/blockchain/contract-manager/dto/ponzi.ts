import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsEnum, IsEthereumAddress, IsInt, IsString, Min } from "class-validator";
import { Transform, Type } from "class-transformer";

import type { IPonziContractDeployDto } from "@framework/types";
import { PonziContractTemplates } from "@framework/types";

export class PonziContractDeployDto implements IPonziContractDeployDto {
  @ApiProperty({
    enum: PonziContractTemplates,
  })
  @Transform(({ value }) => value as PonziContractTemplates)
  @IsEnum(PonziContractTemplates, { message: "badInput" })
  public contractTemplate: PonziContractTemplates;

  @ApiProperty({
    type: String,
    isArray: true,
  })
  @IsArray({ message: "typeMismatch" })
  @IsString({ each: true, message: "typeMismatch" })
  @IsEthereumAddress({ each: true, message: "patternMismatch" })
  @Type(() => String)
  public payees: Array<string>;

  @ApiProperty({
    type: Number,
    isArray: true,
    minimum: 1,
  })
  @IsArray({ message: "typeMismatch" })
  @IsInt({ each: true, message: "typeMismatch" })
  @Min(1, { each: true, message: "rangeUnderflow" })
  @Type(() => Number)
  public shares: Array<number>;
}
