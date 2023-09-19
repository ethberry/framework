import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsString, Min, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { PriceDto } from "../../../exchange/asset/dto";
import { IRentCreateDto } from "../interfaces";

export class RentCreateDto implements IRentCreateDto {
  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  public title: string;

  @ApiProperty({
    type: PriceDto,
  })
  @ValidateNested()
  @Type(() => PriceDto)
  public price: PriceDto;

  @ApiProperty({
    minimum: 1,
  })
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public contractId: number;
}
