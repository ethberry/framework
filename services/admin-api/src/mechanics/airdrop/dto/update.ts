import { ApiPropertyOptional } from "@nestjs/swagger";
import { ValidateNested, IsOptional, IsString } from "class-validator";
import { Type } from "class-transformer";

import { IAirdropItemUpdateDto } from "../interfaces";
import { IAssetDto } from "../../../blockchain/asset/interfaces";
import { AssetDto } from "../../../blockchain/asset/dto";

export class AirdropItemUpdateDto implements IAirdropItemUpdateDto {
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
