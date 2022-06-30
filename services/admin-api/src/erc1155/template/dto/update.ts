import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsInt, IsJSON, ValidateNested, IsOptional, IsString, IsUrl, Min } from "class-validator";
import { Type } from "class-transformer";

import { IsBigNumber } from "@gemunion/nest-js-validators";
import { UniTemplateStatus } from "@framework/types";

import { IErc1155TemplateUpdateDto } from "../interfaces";
import { AssetDto } from "../../../blockchain/asset/dto";

export class Erc1155TemplateUpdateDto implements IErc1155TemplateUpdateDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: "typeMismatch" })
  public title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsJSON({ message: "patternMismatch" })
  public description: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsJSON({ message: "patternMismatch" })
  public attributes: string;

  @ApiPropertyOptional({
    type: AssetDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => AssetDto)
  public price: AssetDto;

  @ApiPropertyOptional({
    type: Number,
    minimum: 1,
  })
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public erc20TokenId: number;

  @ApiPropertyOptional({
    minimum: 0,
  })
  @IsOptional()
  @IsBigNumber({ minimum: "0" }, { message: "typeMismatch" })
  public amount: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: "typeMismatch" })
  @IsUrl({}, { message: "patternMismatch" })
  public imageUrl: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(UniTemplateStatus, { message: "badInput" })
  public templateStatus: UniTemplateStatus;
}
