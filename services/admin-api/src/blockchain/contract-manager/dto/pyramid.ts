import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsEnum } from "class-validator";
import { Transform } from "class-transformer";

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
}
