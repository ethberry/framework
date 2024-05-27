import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsString, IsUrl, Min, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { SearchableDto } from "@gemunion/collection";
import { NotNativeDto, SemiCoinDto } from "@gemunion/nest-js-validators";

import type { ILootBoxCreateDto } from "../interfaces";

export class LootBoxCreateDto extends SearchableDto implements ILootBoxCreateDto {
  @ApiProperty({
    type: NotNativeDto,
  })
  @ValidateNested()
  @Type(() => NotNativeDto)
  public item: InstanceType<typeof NotNativeDto>;

  @ApiProperty({
    type: SemiCoinDto,
  })
  @ValidateNested()
  @Type(() => SemiCoinDto)
  public price: InstanceType<typeof SemiCoinDto>;

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
