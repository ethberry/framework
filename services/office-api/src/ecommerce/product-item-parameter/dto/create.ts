import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsInt, IsString, Min } from "class-validator";

import { IProductItemParameterCreateDto } from "../interfaces";

export class ProductItemParameterCreateDto implements IProductItemParameterCreateDto {
  @ApiProperty({
    minimum: 1,
  })
  @IsInt({ each: true, message: "typeMismatch" })
  @Min(1, { each: true, message: "valueMissing" })
  public productItemId: number;

  @ApiPropertyOptional({
    minimum: 1,
  })
  @IsInt({ each: true, message: "typeMismatch" })
  @Min(1, { each: true, message: "valueMissing" })
  public parameterId: number | null;

  @ApiPropertyOptional({
    minimum: 1,
  })
  @IsInt({ each: true, message: "typeMismatch" })
  @Min(1, { each: true, message: "valueMissing" })
  public customParameterId: number | null;

  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  public userCustomValue: string;
}
