import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { BalanceEntity } from "./balance.entity";
import { UserEntity } from "../../../user/user.entity";

@Injectable()
export class BalanceService {
  constructor(
    @InjectRepository(BalanceEntity)
    private readonly balanceEntityRepository: Repository<BalanceEntity>,
  ) {}

  public getBalanceByUser(userEntity: UserEntity): Promise<Array<BalanceEntity>> {
    const queryBuilder = this.balanceEntityRepository.createQueryBuilder("balance");
    queryBuilder.select(["balance.amount"]);

    queryBuilder.andWhere("balance.account = :account", { account: userEntity.wallet });

    queryBuilder.leftJoin("balance.token", "token");
    queryBuilder.addSelect(["token.attributes", "token.tokenId"]);

    queryBuilder.leftJoin("token.template", "template");
    queryBuilder.addSelect(["template.title", "template.description", "template.imageUrl"]);

    queryBuilder.leftJoin("template.contract", "contract");
    queryBuilder.addSelect(["contract.address"]);

    return queryBuilder.getMany();
  }
}
