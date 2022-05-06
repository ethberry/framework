import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsJSON, IsOptional } from "class-validator";

import { IErc721TokenUpdateDto } from "../interfaces";

export class Erc721TokenUpdateDto implements IErc721TokenUpdateDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsJSON({ message: "patternMismatch" })
  public attributes: string;
}
