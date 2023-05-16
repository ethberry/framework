import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, In, Repository } from "typeorm";

import { IBalanceAutocompleteDto, IBalanceSearchDto, ModuleType } from "@framework/types";

import { UserEntity } from "../../../infrastructure/user/user.entity";
import { ContractEntity } from "../contract/contract.entity";
import { BalanceEntity } from "./balance.entity";

@Injectable()
export class BalanceService {
  constructor(
    @InjectRepository(BalanceEntity)
    private readonly balanceEntityRepository: Repository<BalanceEntity>,
  ) {}

  public findOne(
    where: FindOptionsWhere<BalanceEntity>,
    options?: FindOneOptions<BalanceEntity>,
  ): Promise<BalanceEntity | null> {
    return this.balanceEntityRepository.findOne({ where, ...options });
  }

  public searchByAddress(address: string): Promise<Array<BalanceEntity>> {
    return this.balanceEntityRepository.find({
      where: {
        account: address,
        token: {
          template: {
            contract: {
              contractModule: ModuleType.HIERARCHY,
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

  public search(dto: IBalanceSearchDto, userEntity: UserEntity): Promise<[Array<BalanceEntity>, number]> {
    const { contractIds, templateIds, targetIds, accounts, skip, take } = dto;

    const queryBuilder = this.balanceEntityRepository.createQueryBuilder("balance");

    queryBuilder.select();

    queryBuilder.leftJoinAndSelect("balance.token", "token");
    queryBuilder.leftJoinAndSelect("token.template", "template");
    queryBuilder.leftJoinAndSelect("template.contract", "contract");

    queryBuilder.andWhere("contract.chainId = :chainId", {
      chainId: userEntity.chainId,
    });

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

    if (targetIds) {
      if (targetIds.length === 1) {
        queryBuilder.andWhere("balance.targetId = :targetId", {
          targetId: targetIds[0],
        });
      } else {
        queryBuilder.andWhere("token.targetId IN(:...targetIds)", { targetIds });
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

  public async autocomplete(dto: IBalanceAutocompleteDto): Promise<Array<BalanceEntity>> {
    const { contractType = [], contractModule = [], contractIds = [], tokenIds = [] } = dto;

    const where = {
      token: {
        template: {
          contract: {},
        },
      },
    };

    if (contractType.length) {
      Object.assign(where.token.template.contract, {
        contractType: In(contractType),
      });
    }

    if (contractModule.length) {
      Object.assign(where.token.template.contract, {
        contractModule: In(contractModule),
      });
    }

    if (contractIds.length) {
      Object.assign(where.token.template, {
        contractId: In(contractIds),
      });
    }

    if (tokenIds.length) {
      Object.assign(where, {
        tokenId: In(tokenIds),
      });
    }

    return this.balanceEntityRepository.find({
      where,
      select: {
        account: true,
        amount: true,
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
