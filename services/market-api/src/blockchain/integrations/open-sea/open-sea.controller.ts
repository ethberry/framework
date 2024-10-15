import { Body, Controller, Post } from "@nestjs/common";

import { Public, User } from "@ethberry/nest-js-utils";

import { OpenSeaService } from "./open-sea.service";
import { SellTokenDto } from "./dto";
import { UserEntity } from "../../../infrastructure/user/user.entity";

@Public()
@Controller("/open-sea")
export class OpenSeaController {
  constructor(private readonly openSeaService: OpenSeaService) {}

  @Post("/sell")
  public sell(@Body() dto: SellTokenDto, @User() userEntity: UserEntity): Promise<any> {
    return this.openSeaService.sell(dto, userEntity);
  }
}
