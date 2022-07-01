import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsJSON, IsOptional } from "class-validator";

import { ITokenUpdateDto } from "../interfaces";

export class TokenUpdateDto implements ITokenUpdateDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsJSON({ message: "patternMismatch" })
  public attributes: string;
}
