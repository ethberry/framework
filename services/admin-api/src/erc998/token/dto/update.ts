import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsJSON, IsOptional } from "class-validator";

import { IUniTokenUpdateDto } from "../interfaces";

export class Erc998TokenUpdateDto implements IUniTokenUpdateDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsJSON({ message: "patternMismatch" })
  public attributes: string;
}
