import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEnum, IsInt, IsJSON, IsNumber, IsString, Min, ValidateIf, ValidateNested } from "class-validator";
import { Transform, Type } from "class-transformer";

import { IsBigNumber } from "@gemunion/nest-js-validators";
import { TokenType } from "@framework/types";

import { IStakingCreateDto, IStakingItemCreateDto } from "../interfaces";

export class StakingItemCreateDto implements IStakingItemCreateDto {
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
}

export class StakingCreateDto implements IStakingCreateDto {
  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  public title: string;

  @ApiProperty()
  @IsJSON({ message: "patternMismatch" })
  public description: string;

  @ApiProperty({
    type: StakingItemCreateDto,
  })
  @ValidateNested()
  @Type(() => StakingItemCreateDto)
  public deposit: StakingItemCreateDto;

  @ApiProperty({
    type: StakingItemCreateDto,
  })
  @ValidateNested()
  @Type(() => StakingItemCreateDto)
  public reward: StakingItemCreateDto;

  @ApiProperty()
  @IsInt({ message: "typeMismatch" })
  @Min(0, { message: "rangeUnderflow" })
  public duration: number;

  @ApiProperty()
  @IsNumber({ maxDecimalPlaces: 2 }, { message: "typeMismatch" })
  @Min(0, { message: "rangeUnderflow" })
  public penalty: number;

  @ApiProperty()
  @IsBoolean({ message: "typeMismatch" })
  public recurrent: boolean;

  @ApiProperty({
    type: Number,
    minimum: 1,
  })
  @IsBigNumber({ allowEmptyString: true }, { message: "typeMismatch" })
  public ruleId: string;
}
