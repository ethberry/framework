import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsJSON, IsOptional } from "class-validator";

import { IErc998TokenUpdateDto } from "../interfaces";

export class Erc998TokenUpdateDto implements IErc998TokenUpdateDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsJSON({ message: "patternMismatch" })
  public attributes: string;
}
