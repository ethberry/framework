import {ApiPropertyOptional} from "@nestjs/swagger";

import {IsConfirm, IsPassword} from "@gemunionstudio/nest-js-validators";

import {UserCommonDto} from "../../common/dto";
import {IProfileUpdateDto} from "../interfaces";

export class ProfileUpdateDto extends UserCommonDto implements IProfileUpdateDto {
  @ApiPropertyOptional()
  @IsPassword({
    required: false,
  })
  public password: string;

  @ApiPropertyOptional()
  @IsConfirm()
  public confirm: string;
}
