import { Controller, Get, HttpCode, HttpStatus, Post, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, User } from "@gemunion/nest-js-utils";

import { UserEntity } from "../../infrastructure/user/user.entity";
import { BalanceService } from "./balance.service";
import { BalanceEntity } from "./balance.entity";

@ApiBearerAuth()
@Controller("/game")
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}

  @Get("/balance")
  @UseInterceptors(NotFoundInterceptor)
  public getBalance(@User() userEntity: UserEntity): Promise<BalanceEntity | null> {
    return this.balanceService.findOne({ userId: userEntity.id });
  }

  @Post("/balance")
  @HttpCode(HttpStatus.NO_CONTENT)
  public redeemBalance(@User() userEntity: UserEntity): Promise<void> {
    return this.balanceService.redeemBalance(userEntity);
  }
}
