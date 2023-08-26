import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsInt, Min, ValidateNested } from "class-validator";
import { Transform, Type } from "class-transformer";

import { PaginationDto } from "@gemunion/collection";
import type { IPonziLeaderboardItemSearchDto, IPonziLeaderboardSearchDto } from "@framework/types";
import { TokenType } from "@framework/types";

export class PonziReportItemSearchDto implements IPonziLeaderboardItemSearchDto {
  @ApiProperty({
    enum: TokenType,
  })
  @Transform(({ value }) => value as TokenType)
  @IsEnum(TokenType, { message: "badInput" })
  public tokenType: TokenType;

  @ApiProperty({
    minimum: 1,
  })
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  @Type(() => Number)
  public contractId: number;
}

export class PonziLeaderboardSearchDto extends PaginationDto implements IPonziLeaderboardSearchDto {
  @ApiProperty({
    type: PonziReportItemSearchDto,
  })
  @ValidateNested()
  @Type(() => PonziReportItemSearchDto)
  public deposit: PonziReportItemSearchDto;

  @ApiProperty({
    type: PonziReportItemSearchDto,
  })
  @ValidateNested()
  @Type(() => PonziReportItemSearchDto)
  public reward: PonziReportItemSearchDto;
}
