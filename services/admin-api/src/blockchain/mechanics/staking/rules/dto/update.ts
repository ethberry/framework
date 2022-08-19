import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsInt, IsJSON, IsNumber, IsOptional, IsString, Min, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { IStakingUpdateDto } from "../interfaces";
import { AssetDto } from "../../../asset/dto";

export class StakingUpdateDto implements IStakingUpdateDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public id?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: "typeMismatch" })
  public title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsJSON({ message: "patternMismatch" })
  public description: string;

  @ApiPropertyOptional({
    type: AssetDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => AssetDto)
  public deposit: AssetDto;

  @ApiPropertyOptional({
    type: AssetDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => AssetDto)
  public reward: AssetDto;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt({ message: "typeMismatch" })
  @Min(0, { message: "rangeUnderflow" })
  public duration: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 }, { message: "typeMismatch" })
  @Min(0, { message: "rangeUnderflow" })
  public penalty: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean({ message: "typeMismatch" })
  public recurrent: boolean;
}
