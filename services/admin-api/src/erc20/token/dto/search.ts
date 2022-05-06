import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsEnum, IsOptional } from "class-validator";
import { Transform } from "class-transformer";

import { SearchDto } from "@gemunion/collection";
import { Erc20TokenStatus, IErc20TokenSearchDto } from "@framework/types";

export class Erc20TokenSearchDto extends SearchDto implements IErc20TokenSearchDto {
  @ApiPropertyOptional({
    enum: Erc20TokenStatus,
    isArray: true,
    // https://github.com/OAI/OpenAPI-Specification/issues/1706
    // format: "deepObject"
  })
  @IsOptional()
  @IsArray({ message: "typeMismatch" })
  @Transform(({ value }) => value as Array<Erc20TokenStatus>)
  @IsEnum(Erc20TokenStatus, { each: true, message: "badInput" })
  public tokenStatus: Array<Erc20TokenStatus>;
}
