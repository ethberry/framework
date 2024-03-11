import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsString, IsUrl, Min, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { IsBigInt } from "@gemunion/nest-js-validators";
import { SearchableDto } from "@gemunion/collection";

import type { ITemplateCreateDto } from "../interfaces";
import { SemiCoinDto } from "../../../exchange/asset/dto";

export class TemplateCreateDto extends SearchableDto implements ITemplateCreateDto {
  @ApiProperty({
    type: SemiCoinDto,
  })
  @ValidateNested()
  @Type(() => SemiCoinDto)
  public price: InstanceType<typeof SemiCoinDto>;

  @ApiProperty({
    minimum: 0,
  })
  @IsBigInt({ minimum: 0 }, { message: "typeMismatch" })
  public amount: string;

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
