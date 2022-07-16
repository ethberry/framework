import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { IClaimItemUpdateDto } from "../interfaces";
import { IAssetDto } from "../../asset/interfaces";
import { AssetDto } from "../../asset/dto";

export class ClaimItemUpdateDto implements IClaimItemUpdateDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: "typeMismatch" })
  public account: string;

  @ApiPropertyOptional({
    type: AssetDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => AssetDto)
  public item: IAssetDto;
}
