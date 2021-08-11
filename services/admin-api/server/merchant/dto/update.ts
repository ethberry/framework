import {ApiProperty} from "@nestjs/swagger";

import {MerchantStatus} from "@gemunionstudio/framework-types";
import {IsString} from "@gemunionstudio/nest-js-validators";

import {IMerchantUpdateDto} from "../interfaces";
import {MerchantCreateDto} from "./create";

export class MerchantUpdateDto extends MerchantCreateDto implements IMerchantUpdateDto {
  @ApiProperty({
    enum: MerchantStatus,
  })
  @IsString({
    enum: MerchantStatus,
  })
  public merchantStatus: MerchantStatus;
}
