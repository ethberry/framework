import { Body, Controller, Post } from "@nestjs/common";

import { User } from "@gemunion/nest-js-utils";

import { UserEntity } from "../user/user.entity";
import { MerchantService } from "./merchant.service";
import { MerchantEntity } from "./merchant.entity";
import { MerchantCreateDto } from "./dto";

@Controller("/merchants")
export class MerchantControllerPrivate {
  constructor(private readonly merchantService: MerchantService) {}

  @Post("/")
  public update(@Body() dto: MerchantCreateDto, @User() userEntity: UserEntity): Promise<MerchantEntity | null> {
    return this.merchantService.create(dto, userEntity);
  }
}
