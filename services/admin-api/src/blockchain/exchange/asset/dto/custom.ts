import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsInt, IsOptional, Min, Validate, ValidateIf, ValidateNested } from "class-validator";
import { Transform, Type } from "class-transformer";

import { IAssetComponentDto, IAssetDto, TokenType } from "@framework/types";

import { ForbidEnumValues, IsBigInt } from "@gemunion/nest-js-validators";

export const createCustomAssetComponentDto = (tokenTypes: Array<TokenType>) => {
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
    @Validate(ForbidEnumValues, tokenTypes)
    @IsEnum(TokenType, { message: "badInput" })
    public tokenType: TokenType;

    @ApiProperty()
    @IsInt({ message: "typeMismatch" })
    @Min(1, { message: "rangeUnderflow" })
    public contractId: number;

    @ApiProperty()
    @IsInt({ message: "typeMismatch" })
    @Min(1, { message: "rangeUnderflow" })
    @ValidateIf(o => tokenTypes.includes(o.TokenType))
    public templateId: number;

    @ApiProperty({
      type: Number,
    })
    @IsBigInt({}, { message: "typeMismatch" })
    @ValidateIf(o => tokenTypes.includes(o.TokenType))
    public amount: string;
  }

  return CustomAssetComponentDto;
};

export const createCustomAssetDto = (tokenTypes: Array<TokenType>) => {
  const CustomComponentDto = createCustomAssetComponentDto(tokenTypes);

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

export const NftDto = createCustomAssetDto([TokenType.NATIVE, TokenType.ERC20, TokenType.ERC1155]);
