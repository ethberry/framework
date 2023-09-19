import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsOptional } from "class-validator";
import { Transform } from "class-transformer";

import { TokenType } from "@framework/types";
import { ITemplateNewDto } from "../interfaces";

export class TemplateNewDto implements ITemplateNewDto {
  @ApiPropertyOptional({
    enum: TokenType,
  })
  @IsOptional()
  @Transform(({ value }) => value as TokenType)
  @IsEnum(TokenType, { message: "badInput" })
  public contractType: TokenType;
}
