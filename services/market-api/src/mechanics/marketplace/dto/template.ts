import { ApiProperty } from "@nestjs/swagger";
import { ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { ISignTemplateDto } from "../interfaces";
import { AssetDto } from "../../../blockchain/asset/dto";

export class SignTemplateDto implements ISignTemplateDto {
  @ApiProperty({
    type: AssetDto,
  })
  @ValidateNested()
  @Type(() => AssetDto)
  public item: AssetDto;
}
