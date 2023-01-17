import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsEnum, IsInt, IsString, IsEthereumAddress, Min } from "class-validator";
import { Transform, Type } from "class-transformer";

import type { IPyramidContractDeployDto } from "@framework/types";
import { PyramidContractFeatures } from "@framework/types";

export class PyramidContractDeployDto implements IPyramidContractDeployDto {
  @ApiProperty({
    enum: PyramidContractFeatures,
    isArray: true,
  })
  @IsArray({ message: "typeMismatch" })
  @Transform(({ value }) => value as Array<PyramidContractFeatures>)
  @IsEnum(PyramidContractFeatures, { each: true, message: "badInput" })
  public contractFeatures: Array<PyramidContractFeatures>;

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
