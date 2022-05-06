import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsJSON, IsOptional } from "class-validator";

import { IErc20TokenUpdateDto } from "../interfaces";
import { Erc20TokenStatus } from "@framework/types";

export class Erc20TokenUpdateDto implements IErc20TokenUpdateDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsJSON({ message: "patternMismatch" })
  public description: string;

  public tokenStatus: Erc20TokenStatus;
}
