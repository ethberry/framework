import { Body, Controller, Post } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import type { IServerSignature } from "@gemunion/types-blockchain";

import { MysteryBoxSignDto } from "./dto";
import { MysterySignService } from "./sign.service";
import { User } from "@gemunion/nest-js-utils";
import { UserEntity } from "../../../../../infrastructure/user/user.entity";

@ApiBearerAuth()
@Controller("/mystery")
export class MysterySignController {
  constructor(private readonly mysterySignService: MysterySignService) {}

  @Post("/sign")
  public sign(@Body() dto: MysteryBoxSignDto, @User() userEntity: UserEntity): Promise<IServerSignature> {
    return this.mysterySignService.sign(dto, userEntity);
  }
}
