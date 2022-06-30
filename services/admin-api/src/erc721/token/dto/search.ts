import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsEnum, IsNumber, IsOptional, Min } from "class-validator";
import { Transform, Type } from "class-transformer";

import { SearchDto } from "@gemunion/collection";
import { UniTokenStatus, IErc721TokenSearchDto, TokenRarity } from "@framework/types";
import { IsBigNumber } from "@gemunion/nest-js-validators";

export class Erc721TokenSearchDto extends SearchDto implements IErc721TokenSearchDto {
  @ApiPropertyOptional({
    enum: UniTokenStatus,
    isArray: true,
    // https://github.com/OAI/OpenAPI-Specification/issues/1706
    // format: "deepObject"
  })
  @IsOptional()
  @IsArray({ message: "typeMismatch" })
  @Transform(({ value }) => value as Array<UniTokenStatus>)
  @IsEnum(UniTokenStatus, { each: true, message: "badInput" })
  public tokenStatus: Array<UniTokenStatus>;

  @ApiPropertyOptional({
    type: Number,
    isArray: true,
    minimum: 1,
  })
  @IsOptional()
  @IsArray({ message: "typeMismatch" })
  @IsNumber({}, { each: true, message: "typeMismatch" })
  @Min(1, { each: true, message: "rangeUnderflow" })
  @Type(() => Number)
  public uniContractIds: Array<number>;

  @ApiPropertyOptional({
    enum: TokenRarity,
    isArray: true,
    // https://github.com/OAI/OpenAPI-Specification/issues/1706
    // format: "deepObject"
  })
  @IsOptional()
  @IsArray({ message: "typeMismatch" })
  @Transform(({ value }) => value as Array<TokenRarity>)
  @IsEnum(TokenRarity, { each: true, message: "badInput" })
  public rarity: Array<TokenRarity>;

  @ApiPropertyOptional({
    type: Number,
    minimum: 1,
  })
  @IsOptional()
  @IsBigNumber({ allowEmptyString: true }, { message: "typeMismatch" })
  public tokenId: string;
}
