import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { BalanceEntity } from "./balance.entity";
import { IBalanceAutocompleteDto, IBalanceSearchDto } from "@framework/types";

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
        // token: {
        //   template: {
        //     contract: {
        //       contractType,
        //     },
        //   },
        // },
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

  public search(dto: IBalanceSearchDto): Promise<[Array<BalanceEntity>, number]> {
    const { accounts, tokenIds, contractIds, minBalance, maxBalance, skip, take } = dto;

    const queryBuilder = this.balanceEntityRepository.createQueryBuilder("balance");

    queryBuilder.select();

    queryBuilder.leftJoinAndSelect("balance.token", "token");
    queryBuilder.leftJoinAndSelect("token.template", "template");
    queryBuilder.leftJoinAndSelect("template.contract", "contract");

    // if (accounts) {
    //   if (accounts.length === 1) {
    //     queryBuilder.andWhere("balance.account = :account", { account: accounts[0] });
    //   } else {
    //     queryBuilder.andWhere("balance.account IN(:...accounts)", { accounts });
    //   }
    // }

    if (contractIds) {
      if (contractIds.length === 1) {
        queryBuilder.andWhere("template.contractId = :contractId", {
          contractId: contractIds[0],
        });
      } else {
        queryBuilder.andWhere("template.contractId IN(:...contractIds)", { contractIds });
      }
    }

    if (tokenIds) {
      if (tokenIds.length === 1) {
        queryBuilder.andWhere("balance.tokenId = :tokenId", {
          tokenId: tokenIds[0],
        });
      } else {
        queryBuilder.andWhere("balance.tokenId IN(:...tokenIds)", { tokenIds });
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

    if (minBalance || maxBalance) {
      if (maxBalance) {
        queryBuilder.andWhere("balance.amount <= :maxBalance", { maxBalance });
      }

      if (minBalance) {
        queryBuilder.andWhere("balance.amount >= :minBalance", { minBalance });
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
