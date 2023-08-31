import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { ValidateNested, IsEnum, IsInt, IsOptional, Min, Validate, ValidateIf } from "class-validator";
import { Type, Transform } from "class-transformer";
import { ForbidEnumValues, IsBigInt } from "@gemunion/nest-js-validators";

import type { IDismantleCreateDto } from "../interfaces";
import { IAssetComponentDto, IAssetDto, TokenType } from "@framework/types";
import { AssetTypesDto } from "../../../../exchange/asset/dto/custom";

export class DismantlePriceComponentDto implements IAssetComponentDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public id?: number;

  @ApiProperty({
    enum: TokenType,
  })
  @Transform(({ value }) => value as TokenType)
  @Validate(ForbidEnumValues, [TokenType.NATIVE])
  @IsEnum(TokenType, { message: "badInput" })
  public tokenType: TokenType;

  @ApiProperty()
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public contractId: number;

  @ApiProperty()
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  @ValidateIf(o => [TokenType.ERC721, TokenType.ERC998, TokenType.ERC1155].includes(o.TokenType))
  public templateId: number;

  @ApiProperty({
    type: Number,
  })
  @IsBigInt({}, { message: "typeMismatch" })
  @ValidateIf(o => [TokenType.NATIVE, TokenType.ERC20, TokenType.ERC1155].includes(o.TokenType))
  public amount: string;
}

export class DismantlePriceDto implements IAssetDto {
  @ApiProperty({
    type: DismantlePriceComponentDto,
    isArray: true,
  })
  @ValidateNested({ each: true })
  @Type(() => DismantlePriceComponentDto)
  public components: Array<DismantlePriceComponentDto>;
}

export class DismantleCreateDto implements IDismantleCreateDto {
  // ITEMS to get aftr dismantle
  @ApiProperty({
    type: DismantlePriceDto,
  })
  @ValidateNested()
  @Type(() => DismantlePriceDto)
  public item: DismantlePriceDto;

  // TOKEN to be dismantled
  @ApiProperty({
    type: AssetTypesDto([TokenType.NATIVE, TokenType.ERC20, TokenType.ERC1155]),
  })
  @ValidateNested()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  @Type(() => AssetTypesDto([TokenType.NATIVE, TokenType.ERC20, TokenType.ERC1155]))
  public price: typeof AssetTypesDto.prototype;
}
