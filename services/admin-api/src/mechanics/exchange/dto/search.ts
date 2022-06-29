import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsEnum, IsOptional } from "class-validator";
import { Transform } from "class-transformer";

import { SearchDto } from "@gemunion/collection";
import { ExchangeStatus, IExchangeSearchDto } from "@framework/types";

export class Erc721RecipeSearchDto extends SearchDto implements IExchangeSearchDto {
  @ApiPropertyOptional({
    enum: ExchangeStatus,
    isArray: true,
    // https://github.com/OAI/OpenAPI-Specification/issues/1706
    // format: "deepObject"
  })
  @IsOptional()
  @IsArray({ message: "typeMismatch" })
  @Transform(({ value }) => value as Array<ExchangeStatus>)
  @IsEnum(ExchangeStatus, { each: true, message: "badInput" })
  public exchangeStatus: Array<ExchangeStatus>;
}
