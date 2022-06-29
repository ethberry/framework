import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsInt, Min, ValidateIf, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { IExchangeCreateDto } from "../interfaces";
import { AssetDto } from "../../../blockchain/asset/dto";

export class ExchangeCreateDto implements IExchangeCreateDto {
  @ApiProperty()
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  @ValidateIf(o => !o.erc721DropboxId)
  public uniTemplateIds: number;

  @ApiPropertyOptional()
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  @ValidateIf(o => !o.uniTemplateIds)
  public erc721DropboxId: number;

  @ApiProperty({
    type: AssetDto,
  })
  @ValidateNested()
  @Type(() => AssetDto)
  public ingredients: AssetDto;
}
