import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsJSON, IsOptional, IsString, IsUrl, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { MysteryBoxStatus } from "@framework/types";

import type { IMysteryBoxUpdateDto } from "../interfaces";
import { SemiCoinDto, NftDto } from "@gemunion/nest-js-validators";

export class MysteryBoxUpdateDto implements IMysteryBoxUpdateDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: "typeMismatch" })
  public title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsJSON({ message: "patternMismatch" })
  public description: string;

  @ApiPropertyOptional({
    type: NftDto,
  })
  @ValidateNested()
  @Type(() => NftDto)
  public content: InstanceType<typeof NftDto>;

  @ApiPropertyOptional({
    type: SemiCoinDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => SemiCoinDto)
  public price: InstanceType<typeof SemiCoinDto>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl({}, { message: "patternMismatch" })
  @IsString({ message: "typeMismatch" })
  public imageUrl: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(MysteryBoxStatus, { message: "badInput" })
  public mysteryBoxStatus: MysteryBoxStatus;
}
