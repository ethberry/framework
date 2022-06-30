import { ClassSerializerInterceptor, Controller, Get, Param, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { SyncService } from "./sync.service";
import { UserEntity } from "../user/user.entity";
import { UniBalanceEntity } from "../blockchain/uni-token/uni-balance/uni-balance.entity";

@ApiBearerAuth()
@Controller("/sync")
export class SyncController {
  constructor(private readonly tokenService: SyncService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get("/:sub/profile")
  public getProfileBySub(@Param("sub") sub: string): Promise<UserEntity> {
    return this.tokenService.getProfileBySub(sub);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get("/:sub/balance")
  public getBalanceBySub(@Param("sub") sub: string): Promise<Array<UniBalanceEntity>> {
    return this.tokenService.getBalanceBySub(sub);
  }
}
