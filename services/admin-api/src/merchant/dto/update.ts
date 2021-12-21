import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";

import { MerchantStatus } from "@gemunion/framework-types";

import { IMerchantUpdateDto } from "../interfaces";
import { MerchantCreateDto } from "./create";

export class MerchantUpdateDto extends MerchantCreateDto implements IMerchantUpdateDto {
  @ApiProperty({
    enum: MerchantStatus,
  })
  @IsEnum({ enum: MerchantStatus }, { message: "badInput" })
  public merchantStatus: MerchantStatus;
}
