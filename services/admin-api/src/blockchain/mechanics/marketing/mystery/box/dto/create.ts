import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsString, IsUrl, Min, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { SearchableDto } from "@gemunion/collection";
import { SemiCoinDto, NftDto } from "@gemunion/nest-js-validators";

import type { IMysteryBoxCreateDto } from "../interfaces";

export class MysteryBoxCreateDto extends SearchableDto implements IMysteryBoxCreateDto {
  @ApiProperty({
    type: NftDto,
  })
  @ValidateNested()
  @Type(() => NftDto)
  public content: InstanceType<typeof NftDto>;

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
