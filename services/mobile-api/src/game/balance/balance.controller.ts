import { Controller, Get, Post, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, User } from "@gemunion/nest-js-utils";

import { UserEntity } from "../../infrastructure/user/user.entity";
import { BalanceService } from "./balance.service";

@ApiBearerAuth()
@Controller("/game")
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}

  @Get("/balance")
  @UseInterceptors(NotFoundInterceptor)
  public getBalance(@User() userEntity: UserEntity): Promise<any | undefined> {
    return this.balanceService.findOne({ userId: userEntity.id });
  }

  @Post("/balance")
  public redeemBalance(@User() userEntity: UserEntity): Promise<any | undefined> {
    return this.balanceService.redeemBalance(userEntity);
  }
}
