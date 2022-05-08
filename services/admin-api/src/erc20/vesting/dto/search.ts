import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsEnum, IsInt, IsOptional, Min } from "class-validator";
import { Transform, Type } from "class-transformer";

import { SearchDto } from "@gemunion/collection";
import { Erc20VestingType, IErc20VestingSearchDto } from "@framework/types";

export class Erc20VestingSearchDto extends SearchDto implements IErc20VestingSearchDto {
  @ApiPropertyOptional({
    enum: Erc20VestingType,
    isArray: true,
    // https://github.com/OAI/OpenAPI-Specification/issues/1706
    // format: "deepObject"
  })
  @IsOptional()
  @IsArray({ message: "typeMismatch" })
  @Transform(({ value }) => value as Array<Erc20VestingType>)
  @IsEnum(Erc20VestingType, { each: true, message: "badInput" })
  public vestingType: Array<Erc20VestingType>;

  @ApiPropertyOptional({
    type: Number,
    isArray: true,
    minimum: 1,
  })
  @IsOptional()
  @IsArray({ message: "typeMismatch" })
  @IsInt({ each: true, message: "typeMismatch" })
  @Min(1, { each: true, message: "rangeUnderflow" })
  @Type(() => Number)
  public erc20TokenIds: Array<number>;
}
