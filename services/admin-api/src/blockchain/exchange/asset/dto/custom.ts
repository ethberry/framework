import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsInt, IsOptional, Min, Validate, ValidateIf, ValidateNested } from "class-validator";
import { Transform, Type } from "class-transformer";

import { IAssetComponentDto, IAssetDto, TokenType } from "@framework/types";

import { ForbidEnumValues, IsBigInt } from "@gemunion/nest-js-validators";

export const createCustomAssetComponentDto = (disabledTokenTypes: Array<TokenType>) => {
  class CustomAssetComponentDto implements IAssetComponentDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsInt({ message: "typeMismatch" })
    @Min(1, { message: "rangeUnderflow" })
    public id?: number;

    @ApiProperty({
      enum: TokenType,
    })
    @Transform(({ value }) => value as TokenType)
    @Validate(ForbidEnumValues, disabledTokenTypes)
    @IsEnum(TokenType, { message: "badInput" })
    public tokenType: TokenType;

    @ApiProperty()
    @IsInt({ message: "typeMismatch" })
    @Min(1, { message: "rangeUnderflow" })
    public contractId: number;

    @ApiProperty()
    @IsInt({ message: "typeMismatch" })
    @Min(1, { message: "rangeUnderflow" })
    @ValidateIf(o => disabledTokenTypes.includes(o.TokenType))
    public templateId: number;

    @ApiProperty({
      type: Number,
    })
    @IsBigInt({}, { message: "typeMismatch" })
    @ValidateIf(o => disabledTokenTypes.includes(o.TokenType))
    public amount: string;
  }

  return CustomAssetComponentDto;
};

export const createCustomAssetDto = (disabledTokenTypes: Array<TokenType>) => {
  const CustomComponentDto = createCustomAssetComponentDto(disabledTokenTypes);

  class CustomAssertDto implements IAssetDto {
    @ApiProperty({
      type: CustomComponentDto,
      isArray: true,
    })
    @ValidateNested({ each: true })
    @Type(() => CustomComponentDto)
    public components: Array<InstanceType<typeof CustomComponentDto>>;
  }

  return CustomAssertDto;
};

export const NftDto = createCustomAssetDto([TokenType.ERC721, TokenType.ERC998]);

export const CoinDto = createCustomAssetDto([TokenType.NATIVE, TokenType.ERC20]);

export const NativeDto = createCustomAssetDto([TokenType.NATIVE]);
