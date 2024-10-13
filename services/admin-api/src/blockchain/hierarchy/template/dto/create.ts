import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsString, IsUrl, Min, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { IsBigInt, SemiCoinDto } from "@ethberry/nest-js-validators";
import { SearchableDto } from "@ethberry/collection";

import type { ITemplateCreateDto } from "../interfaces";

export class TemplateCreateDto extends SearchableDto implements ITemplateCreateDto {
  @ApiProperty({
    type: SemiCoinDto,
  })
  @ValidateNested()
  @Type(() => SemiCoinDto)
  public price: InstanceType<typeof SemiCoinDto>;

  @ApiProperty({
    type: Number,
    minimum: 0,
  })
  @IsBigInt({ minimum: 0 }, { message: "typeMismatch" })
  public amount: bigint;

  @ApiProperty()
  @IsUrl({}, { message: "patternMismatch" })
  @IsString({ message: "typeMismatch" })
  public imageUrl: string;

  @ApiProperty({
    minimum: 1,
  })
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public contractId: number;
}
