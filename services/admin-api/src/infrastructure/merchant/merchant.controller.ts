import { Body, Controller, Delete, HttpCode, HttpStatus, Put } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { User } from "@gemunion/nest-js-utils";

import { UserEntity } from "../user/user.entity";
import { MerchantService } from "./merchant.service";
import { MerchantEntity } from "./merchant.entity";
import { MerchantUpdateDto } from "./dto";

@ApiBearerAuth()
@Controller("/merchants")
export class MerchantController {
  constructor(private readonly merchantService: MerchantService) {}

  @Put("/")
  public update(@Body() dto: MerchantUpdateDto, @User() userEntity: UserEntity): Promise<MerchantEntity | null> {
    return this.merchantService.update(dto, userEntity);
  }

  @Delete("/")
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@User() userEntity: UserEntity): Promise<void> {
    await this.merchantService.delete(userEntity);
  }
}
