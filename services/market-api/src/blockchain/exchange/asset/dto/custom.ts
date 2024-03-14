import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsInt, IsOptional, Min, Validate, ValidateIf, ValidateNested } from "class-validator";
import { Transform, Type } from "class-transformer";

import { ForbidEnumValues, IsBigInt } from "@gemunion/nest-js-validators";

import { IAssetComponentDto, IAssetDto, TokenType } from "@framework/types";

export const createCustomAssetComponentDto = (enabledTokenTypes: Array<TokenType>) => {
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
    @Validate(ForbidEnumValues, Object.values(TokenType).filter(x => !enabledTokenTypes.includes(x)))
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
    public amount: string;
  }

  return CustomAssetComponentDto;
};

export const createCustomAssetDto = (enabledTokenTypes: Array<TokenType>) => {
  const CustomComponentDto = createCustomAssetComponentDto(enabledTokenTypes);

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

export const SemiNftDto = createCustomAssetDto([TokenType.ERC721, TokenType.ERC998, TokenType.ERC1155]);

export const CoinDto = createCustomAssetDto([TokenType.NATIVE, TokenType.ERC20]);

export const SemiCoinDto = createCustomAssetDto([TokenType.NATIVE, TokenType.ERC20, TokenType.ERC1155]);

export const NativeDto = createCustomAssetDto([TokenType.NATIVE]);

export const NotNativeDto = createCustomAssetDto([
  TokenType.ERC20,
  TokenType.ERC721,
  TokenType.ERC998,
  TokenType.ERC1155,
]);

export const AllTypesDto = createCustomAssetDto(Object.values(TokenType));
