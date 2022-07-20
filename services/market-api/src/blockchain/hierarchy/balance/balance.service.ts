import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { BalanceEntity } from "./balance.entity";
import { UserEntity } from "../../../user/user.entity";
import { TokenType } from "@framework/types";

@Injectable()
export class BalanceService {
  constructor(
    @InjectRepository(BalanceEntity)
    protected readonly balanceEntity: Repository<BalanceEntity>,
  ) {}

  public search(userEntity: UserEntity, contractType: TokenType): Promise<[Array<BalanceEntity>, number]> {
    return this.balanceEntity.findAndCount({
      where: {
        account: userEntity.wallet,
        token: {
          template: {
            contract: {
              contractType,
            },
          },
        },
      },
      join: {
        alias: "balance",
        leftJoinAndSelect: {
          token: "balance.token",
          template: "token.template",
          contract: "template.contract",
        },
      },
    });
  }
}
