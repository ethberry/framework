import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsOptional, Min, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { IRentUpdateDto } from "../interfaces";
import { PriceDto } from "../../../exchange/asset/dto";

export class RentUpdateDto implements IRentUpdateDto {
  @ApiProperty({
    minimum: 1,
  })
  @IsOptional()
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public contractId: number;

  @ApiProperty({
    type: PriceDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => PriceDto)
  public price: PriceDto;
}
