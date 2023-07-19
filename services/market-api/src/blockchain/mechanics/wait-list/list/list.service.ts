import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { WaitListListEntity } from "./list.entity";
import { ContractStatus } from "@framework/types";
import { UserEntity } from "../../../../infrastructure/user/user.entity";

@Injectable()
export class WaitListListService {
  constructor(
    @InjectRepository(WaitListListEntity)
    private readonly waitListListEntityRepository: Repository<WaitListListEntity>,
  ) {}

  public async autocomplete(userEntity: UserEntity): Promise<Array<WaitListListEntity>> {
    const queryBuilder = this.waitListListEntityRepository.createQueryBuilder("list");

    queryBuilder.select(["list.id", "list.title"]);

    queryBuilder.leftJoin("list.contract", "contract", "contract.contractStatus = :contractStatus", {
      contractStatus: ContractStatus.ACTIVE,
    });

    queryBuilder.andWhere("list.root IS NULL");
    queryBuilder.andWhere("list.isPrivate = :isPrivate", { isPrivate: false });

    queryBuilder.andWhere(qb => {
      const subQuery = qb
        .subQuery()
        .from(WaitListListEntity, "inner")
        .select(["inner.id"])
        .leftJoin("inner.items", "items")
        .where("items.account = :account", { account: userEntity.wallet })
        .getQuery();

      return `list.id NOT IN ${subQuery}`;
    });

    return queryBuilder.getMany();
  }
}
