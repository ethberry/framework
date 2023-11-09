import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Any, FindManyOptions, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import type { IStakingDepositSearchDto, IToken } from "@framework/types";
import { StakingDepositStatus, TokenType } from "@framework/types";

import { UserEntity } from "../../../../infrastructure/user/user.entity";
import { StakingDepositEntity } from "./deposit.entity";
import { BalanceService } from "../../../hierarchy/balance/balance.service";

export interface IStakingDepositBalanceCheck {
  token: IToken;
  depositAmount: bigint;
  stakingBalance: bigint;
  topUp: boolean;
}

@Injectable()
export class StakingDepositService {
  constructor(
    @InjectRepository(StakingDepositEntity)
    private readonly stakingDepositEntityRepository: Repository<StakingDepositEntity>,
    protected readonly balanceService: BalanceService,
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
    userEntity: UserEntity,
  ): Promise<[Array<StakingDepositEntity>, number]> {
    const {
      contractIds,
      account,
      emptyReward,
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

  public async checkStakingDepositBalance(
    contractId: number,
    address: string,
  ): Promise<Array<IStakingDepositBalanceCheck | null>> {
    // GET ALL ACTIVE DEPOSITS FOR STAKING CONTRACT WITH DEPOSIT ASSET TOKEN_TYPES: NATIVE,ERC20
    const stakingDeposits = await this.findAll(
      {
        stakingDepositStatus: StakingDepositStatus.ACTIVE,
        stakingRule: {
          contractId,
          deposit: { components: { tokenType: Any([TokenType.NATIVE, TokenType.ERC20]) } },
        },
      },
      { relations: { stakingRule: { contract: { merchant: true }, deposit: { components: { contract: true } } } } },
    );

    if (stakingDeposits.length > 0) {
      // ALL DEPOSIT TOKEN'S ADDRESSES
      const depositAssetContracts = [
        ...new Set(
          stakingDeposits
            .map(dep => dep.stakingRule.deposit.components.map(comp => comp.contract.address))
            .reduce((prev, next) => {
              return prev.concat(next);
            }),
        ),
      ];
      // ALL CURRENT STAKING BALANCES
      const stakingBalances = await this.balanceService.searchByAddress(address);

      // EACH DEPOSIT TOKEN BALANCES
      return depositAssetContracts.map(addr => {
        const currentAssetBalance = stakingBalances.filter(bal => bal.token.template.contract.address === addr);
        if (currentAssetBalance.length > 0) {
          const { amount, token } = currentAssetBalance[0];
          const { templateId } = token;
          const depSum = this.getDepositAssetTemplateSum(stakingDeposits, templateId);

          // notify about topUp
          // todo threshold?
          if (BigInt(amount) < depSum) {
            console.info("STAKING", contractId, address);
            console.info("TOKEN", token.template.title, token.template.contract.address);
            console.info("NEED TOP UP AMOUNT", depSum - BigInt(amount));
          }

          return {
            token,
            depositAmount: depSum,
            stakingBalance: BigInt(amount),
            topUp: BigInt(amount) < depSum,
          };
        } else {
          return null;
        }
      });
    } else {
      return [];
    }
  }

  public getDepositAssetTemplateSum(depositArr: StakingDepositEntity[], templateId: number): bigint {
    // filter deposits by given Asset templateId
    const filteredDeps = depositArr.filter(
      dep => dep.stakingRule.deposit.components.filter(comp => comp.templateId === templateId).length > 0,
    );

    let total = BigInt(0);
    if (filteredDeps.length > 0) {
      for (const dep of filteredDeps) {
        for (const comp of dep.stakingRule.deposit.components) {
          if (comp.templateId === templateId) {
            total = total + BigInt(comp.amount);
          }
        }
      }
    }
    return total;
  }
}
