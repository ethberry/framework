import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsString, IsUrl, Min, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { SearchableDto } from "@gemunion/collection";
import { SemiCoinDto, AllTypesDto, createCustomAssetDto } from "@gemunion/nest-js-validators";

import type { IMysteryBoxCreateDto } from "../interfaces";
import { TokenType } from "@gemunion/types-blockchain";

export class MysteryBoxCreateDto extends SearchableDto implements IMysteryBoxCreateDto {
  @ApiProperty({
    type: createCustomAssetDto([TokenType.ERC721, TokenType.ERC998]),
  })
  @ValidateNested()
  @Type(() => createCustomAssetDto([TokenType.ERC721, TokenType.ERC998]))
  public item: InstanceType<typeof AllTypesDto>;

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
