import { Body, Controller, Post } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { User } from "@gemunion/nest-js-utils";
import type { IServerSignature } from "@gemunion/types-blockchain";

import { LotterySignService } from "./sign.service";
import { SignLotteryDto } from "./dto";
import { UserEntity } from "../../../../../infrastructure/user/user.entity";

@ApiBearerAuth()
@Controller("/lottery/ticket")
export class LotterySignController {
  constructor(private readonly lotterySignService: LotterySignService) {}

  @Post("/sign")
  public sign(@Body() dto: SignLotteryDto, @User() userEntity: UserEntity): Promise<IServerSignature> {
    return this.lotterySignService.sign(dto, userEntity);
  }
}
