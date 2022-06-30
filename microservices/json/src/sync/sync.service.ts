import { Injectable, NotFoundException } from "@nestjs/common";

import { UserService } from "../user/user.service";
import { UserEntity } from "../user/user.entity";
import { UniBalanceService } from "../blockchain/uni-token/uni-balance/uni-balance.service";
import { UniBalanceEntity } from "../blockchain/uni-token/uni-balance/uni-balance.entity";

@Injectable()
export class SyncService {
  constructor(private readonly userService: UserService, private readonly uniBalanceService: UniBalanceService) {}

  public async getProfileBySub(sub: string): Promise<UserEntity> {
    const userEntity = await this.userService.findOne({ sub });

    if (!userEntity) {
      throw new NotFoundException("userNotFound");
    }

    return userEntity;
  }

  public async getBalanceBySub(sub: string): Promise<Array<UniBalanceEntity>> {
    const userEntity = await this.getProfileBySub(sub);

    return this.uniBalanceService.findAll(
      {
        account: userEntity.wallet,
      },
      {
        join: {
          alias: "balance",
          leftJoinAndSelect: {
            token: "balance.uniToken",
            template: "token.uniTemplate",
          },
        },
      },
    );
  }
}
