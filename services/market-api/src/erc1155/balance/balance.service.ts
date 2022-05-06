import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Erc1155BalanceEntity } from "./balance.entity";
import { UserEntity } from "../../user/user.entity";

@Injectable()
export class Erc1155BalanceService {
  constructor(
    @InjectRepository(Erc1155BalanceEntity)
    private readonly erc1155BalanceEntityRepository: Repository<Erc1155BalanceEntity>,
  ) {}

  public search(userEntity: UserEntity): Promise<[Array<Erc1155BalanceEntity>, number]> {
    return this.erc1155BalanceEntityRepository.findAndCount({
      where: {
        wallet: userEntity.wallet,
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
