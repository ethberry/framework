import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { IBalanceSearchDto } from "@framework/types";

import { BalanceEntity } from "./balance.entity";
import { ContractEntity } from "../contract/contract.entity";

@Injectable()
export class BalanceService {
  constructor(
    @InjectRepository(BalanceEntity)
    protected readonly balanceEntityRepository: Repository<BalanceEntity>,
  ) {}

  public search(dto: IBalanceSearchDto): Promise<[Array<BalanceEntity>, number]> {
    const { accounts, templateIds, contractIds, skip, take } = dto;

    const queryBuilder = this.balanceEntityRepository.createQueryBuilder("balance");

    queryBuilder.select();

    queryBuilder.leftJoinAndSelect("balance.token", "token");
    queryBuilder.leftJoinAndSelect("token.template", "template");
    queryBuilder.leftJoinAndSelect("template.contract", "contract");

    queryBuilder.innerJoinAndMapOne("balance.owner", ContractEntity, "owner", "balance.account = owner.address");

    if (contractIds) {
      if (contractIds.length === 1) {
        queryBuilder.andWhere("template.contractId = :contractId", {
          contractId: contractIds[0],
        });
      } else {
        queryBuilder.andWhere("template.contractId IN(:...contractIds)", { contractIds });
      }
    }

    if (templateIds) {
      if (templateIds.length === 1) {
        queryBuilder.andWhere("token.templateId = :templateId", {
          templateId: templateIds[0],
        });
      } else {
        queryBuilder.andWhere("token.templateId IN(:...templateIds)", { templateIds });
      }
    }

    if (accounts) {
      if (accounts.length === 1) {
        queryBuilder.andWhere("balance.account = :account", {
          account: accounts[0],
        });
      } else {
        queryBuilder.andWhere("balance.account IN(:...accounts)", { accounts });
      }
    }

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    queryBuilder.orderBy({
      "balance.createdAt": "DESC",
    });

    return queryBuilder.getManyAndCount();
  }
}
