import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsInt, Min, ValidateNested } from "class-validator";
import { Transform, Type } from "class-transformer";

import { PaginationDto } from "@gemunion/collection";
import type { IPyramidLeaderboardItemSearchDto, IPyramidLeaderboardSearchDto } from "@framework/types";
import { TokenType } from "@framework/types";

export class PyramidReportItemSearchDto implements IPyramidLeaderboardItemSearchDto {
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

export class PyramidLeaderboardSearchDto extends PaginationDto implements IPyramidLeaderboardSearchDto {
  @ApiProperty({
    type: PyramidReportItemSearchDto,
  })
  @ValidateNested()
  @Type(() => PyramidReportItemSearchDto)
  public deposit: PyramidReportItemSearchDto;

  @ApiProperty({
    type: PyramidReportItemSearchDto,
  })
  @ValidateNested()
  @Type(() => PyramidReportItemSearchDto)
  public reward: PyramidReportItemSearchDto;
}
