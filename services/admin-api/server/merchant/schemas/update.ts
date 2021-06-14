import {ApiProperty} from "@nestjs/swagger";

import {MerchantStatus} from "@trejgun/solo-types";
import {IsString} from "@trejgun/nest-js-validators";

import {IMerchantUpdateDto} from "../interfaces";
import {MerchantCreateSchema} from "./create";

export class MerchantUpdateSchema extends MerchantCreateSchema implements IMerchantUpdateDto {
  @ApiProperty({
    enum: MerchantStatus,
  })
  @IsString({
    enum: MerchantStatus,
  })
  public merchantStatus: MerchantStatus;
}
