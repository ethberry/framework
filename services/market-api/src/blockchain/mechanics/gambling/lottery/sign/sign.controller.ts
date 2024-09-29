import { Body, Controller, Post } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { User } from "@ethberry/nest-js-utils";
import type { IServerSignature } from "@ethberry/types-blockchain";

import { LotterySignService } from "./sign.service";
import { LotterySignDto } from "./dto";
import { UserEntity } from "../../../../../infrastructure/user/user.entity";

@ApiBearerAuth()
@Controller("/lottery/ticket")
export class LotterySignController {
  constructor(private readonly lotterySignService: LotterySignService) {}

  @Post("/sign")
  public sign(@Body() dto: LotterySignDto, @User() userEntity: UserEntity): Promise<IServerSignature> {
    return this.lotterySignService.sign(dto, userEntity);
  }
}
