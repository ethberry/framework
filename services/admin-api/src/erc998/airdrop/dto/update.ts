import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsInt, IsOptional, IsString } from "class-validator";

import { IErc998AirdropItemUpdateDto } from "../interfaces";

export class Erc998AirdropItemUpdateDto implements IErc998AirdropItemUpdateDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: "typeMismatch" })
  public owner: string;

  @ApiPropertyOptional({
    minimum: 1,
  })
  @IsOptional()
  @IsInt({ message: "typeMismatch" })
  public erc998TemplateId: number;
}
