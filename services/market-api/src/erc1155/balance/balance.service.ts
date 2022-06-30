import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { UserEntity } from "../../user/user.entity";
import { BalanceEntity } from "../../blockchain/hierarchy/balance/balance.entity";

@Injectable()
export class Erc1155BalanceService {
  constructor(
    @InjectRepository(BalanceEntity)
    private readonly erc1155BalanceEntityRepository: Repository<BalanceEntity>,
  ) {}

  public search(userEntity: UserEntity): Promise<[Array<BalanceEntity>, number]> {
    return this.erc1155BalanceEntityRepository.findAndCount({
      where: {
        account: userEntity.wallet,
      },
      join: {
        alias: "balance",
        leftJoinAndSelect: {
          erc1155Token: "balance.erc1155Token",
        },
      },
    });
  }
}
