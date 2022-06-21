import { ApiPropertyOptional, ApiProperty } from "@nestjs/swagger";
import {
  IsJSON,
  IsOptional,
  IsString,
  IsInt,
  IsEnum,
  IsNumber,
  IsBoolean,
  Min,
  ValidateIf,
  ValidateNested,
} from "class-validator";
import { Transform, Type } from "class-transformer";
import { IsBigNumber } from "@gemunion/nest-js-validators";

import { IStakingUpdateDto, IStakingItemUpdateDto } from "../interfaces";
import { TokenType } from "@framework/types";

export class StakingItemUpdateDto implements IStakingItemUpdateDto {
  @ApiProperty({
    enum: TokenType,
  })
  @Transform(({ value }) => value as TokenType)
  @IsEnum(TokenType, { message: "badInput" })
  public tokenType: TokenType;

  @ApiProperty()
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public collection: number;

  @ApiProperty()
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  @ValidateIf(o => [TokenType.ERC721, TokenType.ERC998, TokenType.ERC1155].includes(o.TokenType))
  public tokenId: number;

  @ApiProperty({
    type: Number,
  })
  @IsBigNumber({}, { message: "typeMismatch" })
  @ValidateIf(o => [TokenType.NATIVE, TokenType.ERC20, TokenType.ERC1155].includes(o.TokenType))
  public amount: string;

  @ApiProperty()
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public stakingId: number;
}

export class StakingUpdateDto implements IStakingUpdateDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: "typeMismatch" })
  public title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsJSON({ message: "patternMismatch" })
  public description: string;

  @ApiPropertyOptional({
    type: StakingItemUpdateDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => StakingItemUpdateDto)
  public deposit: StakingItemUpdateDto;

  @ApiPropertyOptional({
    type: StakingItemUpdateDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => StakingItemUpdateDto)
  public reward: StakingItemUpdateDto;

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
