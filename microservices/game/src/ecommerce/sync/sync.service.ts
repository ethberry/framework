import { Injectable, NotFoundException } from "@nestjs/common";

import { UserService } from "../user/user.service";
import { UserEntity } from "../user/user.entity";
import { BalanceService } from "../../blockchain/hierarchy/balance/balance.service";
import { BalanceEntity } from "../../blockchain/hierarchy/balance/balance.entity";

@Injectable()
export class SyncService {
  constructor(private readonly userService: UserService, private readonly balanceService: BalanceService) {}

  public async getProfileBySub(sub: string): Promise<UserEntity> {
    const userEntity = await this.userService.findOne({ sub });

    if (!userEntity) {
      throw new NotFoundException("userNotFound");
    }

    return userEntity;
  }

  public async getBalanceBySub(sub: string): Promise<Array<BalanceEntity>> {
    const userEntity = await this.getProfileBySub(sub);

    return this.balanceService.getBalanceByUser(userEntity);
  }
}
