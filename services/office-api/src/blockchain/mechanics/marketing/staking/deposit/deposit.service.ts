import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindManyOptions, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import type { IStakingDepositSearchDto } from "@framework/types";

import { UserEntity } from "../../../../../infrastructure/user/user.entity";
import { StakingDepositEntity } from "./deposit.entity";

@Injectable()
export class StakingDepositService {
  constructor(
    @InjectRepository(StakingDepositEntity)
    private readonly stakingDepositEntityRepository: Repository<StakingDepositEntity>,
  ) {}

  public findOne(
    where: FindOptionsWhere<StakingDepositEntity>,
    options?: FindOneOptions<StakingDepositEntity>,
  ): Promise<StakingDepositEntity | null> {
    return this.stakingDepositEntityRepository.findOne({ where, ...options });
  }

  public findAll(
    where: FindOptionsWhere<StakingDepositEntity>,
    options?: FindManyOptions<StakingDepositEntity>,
  ): Promise<Array<StakingDepositEntity>> {
    return this.stakingDepositEntityRepository.find({ where, ...options });
  }

  public async search(
    dto: Partial<IStakingDepositSearchDto>,
    _userEntity: UserEntity,
  ): Promise<[Array<StakingDepositEntity>, number]> {
    const {
      contractIds,
      account,
      emptyReward,
      merchantId,
      stakingDepositStatus,
      deposit,
      reward,
      startTimestamp,
      endTimestamp,
      skip,
      take,
    } = dto;

    const queryBuilder = this.stakingDepositEntityRepository.createQueryBuilder("stake");
    queryBuilder.leftJoinAndSelect("stake.stakingRule", "rule");

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

    if (stakingDepositStatus) {
      if (stakingDepositStatus.length === 1) {
        queryBuilder.andWhere("stake.stakingDepositStatus = :stakingDepositStatus", {
          stakingDepositStatus: stakingDepositStatus[0],
        });
      } else {
        queryBuilder.andWhere("stake.stakingDepositStatus IN(:...stakingDepositStatus)", { stakingDepositStatus });
      }
    }

    // deposit always exists
    if (deposit) {
      if (merchantId) {
        queryBuilder.andWhere("deposit_contract.merchantId = :merchantId", {
          merchantId,
        });
      }
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
      if (merchantId) {
        queryBuilder.andWhere("reward_contract.merchantId = :merchantId", {
          merchantId,
        });
      }
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

  public findOneWithRelations(where: FindOptionsWhere<StakingDepositEntity>): Promise<StakingDepositEntity | null> {
    return this.findOne(where, {
      join: {
        alias: "stake",
        leftJoinAndSelect: {
          rule: "stake.stakingRule",
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
