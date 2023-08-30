import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import type { IPonziDepositSearchDto } from "@framework/types";

import { PonziDepositEntity } from "./deposit.entity";
import { UserEntity } from "../../../../infrastructure/user/user.entity";

@Injectable()
export class PonziDepositService {
  constructor(
    @InjectRepository(PonziDepositEntity)
    private readonly ponziDepositEntityEntity: Repository<PonziDepositEntity>,
  ) {}

  public findOne(
    where: FindOptionsWhere<PonziDepositEntity>,
    options?: FindOneOptions<PonziDepositEntity>,
  ): Promise<PonziDepositEntity | null> {
    return this.ponziDepositEntityEntity.findOne({ where, ...options });
  }

  public findAll(
    where: FindOptionsWhere<PonziDepositEntity>,
    options?: FindOneOptions<PonziDepositEntity>,
  ): Promise<Array<PonziDepositEntity>> {
    return this.ponziDepositEntityEntity.find({ where, ...options });
  }

  public async search(
    dto: Partial<IPonziDepositSearchDto>,
    userEntity: UserEntity,
  ): Promise<[Array<PonziDepositEntity>, number]> {
    const {
      contractIds,
      account,
      emptyReward,
      ponziDepositStatus,
      deposit,
      reward,
      startTimestamp,
      endTimestamp,
      skip,
      take,
    } = dto;

    const queryBuilder = this.ponziDepositEntityEntity.createQueryBuilder("stake");
    queryBuilder.leftJoinAndSelect("stake.ponziRule", "rule");

    queryBuilder.leftJoinAndSelect("rule.contract", "contract");
    queryBuilder.leftJoinAndSelect("rule.deposit", "deposit");
    queryBuilder.leftJoinAndSelect("deposit.components", "deposit_components");
    // queryBuilder.leftJoinAndSelect("deposit_components.template", "deposit_template");
    queryBuilder.leftJoinAndSelect("deposit_components.contract", "deposit_contract");

    queryBuilder.leftJoinAndSelect("rule.reward", "reward");
    queryBuilder.leftJoinAndSelect("reward.components", "reward_components");
    // queryBuilder.leftJoinAndSelect("reward_components.template", "reward_template");
    queryBuilder.leftJoinAndSelect("reward_components.contract", "reward_contract");

    queryBuilder.select();

    queryBuilder.andWhere("contract.merchantId = :merchantId", {
      merchantId: userEntity.merchantId,
    });

    if (contractIds) {
      if (contractIds.length === 1) {
        queryBuilder.andWhere("rule.contractId = :contractId", {
          contractId: contractIds[0],
        });
      } else {
        queryBuilder.andWhere("rule.contractId IN(:...contractIds)", { contractIds });
      }
    }

    if (account) {
      queryBuilder.andWhere("stake.account = :account", { account });
    }

    if (ponziDepositStatus) {
      if (ponziDepositStatus.length === 1) {
        queryBuilder.andWhere("stake.ponziDepositStatus = :ponziRuleStatus", {
          ponziRuleStatus: ponziDepositStatus[0],
        });
      } else {
        queryBuilder.andWhere("stake.ponziDepositStatus IN(:...ponziRuleStatus)", { ponziDepositStatus });
      }
    }

    // deposit always exists
    if (deposit) {
      if (deposit.tokenType) {
        if (deposit.tokenType.length === 1) {
          queryBuilder.andWhere("deposit_contract.contractType = :depositTokenType", {
            depositTokenType: deposit.tokenType[0],
          });
        } else {
          queryBuilder.andWhere("deposit_contract.contractType IN(:...depositTokenType)", {
            depositTokenType: deposit.tokenType,
          });
        }
      }
      if (deposit.contractIds) {
        if (deposit.contractIds.length === 1) {
          queryBuilder.andWhere("deposit_contract.id = :depositContractId", {
            depositContractId: deposit.contractIds[0],
          });
        } else {
          queryBuilder.andWhere("deposit_contract.id IN(:...depositContractId)", {
            depositContractId: deposit.contractIds,
          });
        }
      }
    }

    // reward is optional
    if (!emptyReward && reward) {
      if (reward.tokenType) {
        if (reward.tokenType.length === 1) {
          queryBuilder.andWhere("reward_contract.contractType = :rewardTokenType", {
            rewardTokenType: reward.tokenType[0],
          });
        } else {
          queryBuilder.andWhere("reward_contract.contractType IN(:...rewardTokenType)", {
            rewardTokenType: reward.tokenType,
          });
        }
      }
      if (reward.contractIds) {
        if (reward.contractIds.length === 1) {
          queryBuilder.andWhere("reward_contract.id = :rewardContractId", {
            rewardContractId: reward.contractIds[0],
          });
        } else {
          queryBuilder.andWhere("reward_contract.id IN(:...rewardContractId)", {
            rewardContractId: reward.contractIds,
          });
        }
      }
    } else {
      queryBuilder.andWhere("rule.reward IS NULL");
    }

    if (startTimestamp && endTimestamp) {
      queryBuilder.andWhere("stake.createdAt >= :startTimestamp AND stake.createdAt < :endTimestamp", {
        startTimestamp,
        endTimestamp,
      });
    }

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    queryBuilder.orderBy("stake.createdAt", "DESC");

    return queryBuilder.getManyAndCount();
  }

  public findOneWithRelations(where: FindOptionsWhere<PonziDepositEntity>): Promise<PonziDepositEntity | null> {
    return this.findOne(where, {
      join: {
        alias: "stake",
        leftJoinAndSelect: {
          rule: "stake.ponziRule",
          deposit: "rule.deposit",
          deposit_components: "deposit.components",
          deposit_contract: "deposit_components.contract",
          deposit_template: "deposit_components.template",
          reward: "rule.reward",
          reward_components: "reward.components",
          reward_contract: "reward_components.contract",
          reward_template: "reward_components.template",
        },
      },
    });
  }
}
