import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { Any } from "typeorm";

import { Log } from "ethers";
import type { ILogEvent } from "@ethberry/nest-js-module-ethers-gcp";
import type {
  IStakingDepositWithdrawEvent,
  IStakingDepositFinishEvent,
  IStakingDepositReturnEvent,
  IStakingDepositStartEvent,
  IStakingPenaltyEvent,
  IToken,
} from "@framework/types";
import { EmailType, RmqProviderType, SignalEventType, StakingDepositStatus, TokenType } from "@framework/types";

import { NotificatorService } from "../../../../../game/notificator/notificator.service";
import { EventHistoryService } from "../../../../event-history/event-history.service";
import { TemplateService } from "../../../../hierarchy/template/template.service";
import { AssetService } from "../../../../exchange/asset/asset.service";
import { StakingPenaltyService } from "../penalty/penalty.service";
import { StakingRulesService } from "../rules/rules.service";
import { StakingDepositService } from "./deposit.service";
import { TokenService } from "../../../../hierarchy/token/token.service";
import { TemplateEntity } from "../../../../hierarchy/template/template.entity";
import { TokenEntity } from "../../../../hierarchy/token/token.entity";
import { BalanceService } from "../../../../hierarchy/balance/balance.service";
import { StakingDepositEntity } from "./deposit.entity";
import { ContractEntity } from "../../../../hierarchy/contract/contract.entity";

export interface IStakingDepositBalanceCheck {
  token: IToken;
  depositAmount: bigint;
  stakingBalance: bigint;
  topUp: boolean;
}

@Injectable()
export class StakingDepositServiceEth {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    @Inject(RmqProviderType.SIGNAL_SERVICE)
    protected readonly signalClientProxy: ClientProxy,
    @Inject(RmqProviderType.EML_SERVICE)
    private readonly emailClientProxy: ClientProxy,
    private readonly stakingRulesService: StakingRulesService,
    private readonly stakingDepositService: StakingDepositService,
    private readonly eventHistoryService: EventHistoryService,
    private readonly notificatorService: NotificatorService,
    protected readonly assetService: AssetService,
    private readonly templateService: TemplateService,
    private readonly tokenService: TokenService,
    private readonly balanceService: BalanceService,
    private readonly penaltyService: StakingPenaltyService,
  ) {}

  public async depositStart(event: ILogEvent<IStakingDepositStartEvent>, context: Log): Promise<void> {
    // event DepositStart(uint256 stakingId, uint256 ruleId, address owner, uint256 startTimestamp, uint256[] tokenIds);
    const {
      name,
      args: { stakingId, ruleId, owner, startTimestamp, tokenIds },
    } = event;
    const { address, transactionHash } = context;

    await this.eventHistoryService.updateHistory(event, context);

    const stakingRuleEntity = await this.stakingRulesService.findOne(
      { externalId: ruleId, contract: { address: address.toLowerCase() } },
      { relations: { contract: true, deposit: { components: { contract: true } } } },
    );

    if (!stakingRuleEntity) {
      this.loggerService.error("stakingRuleNotFound", ruleId, StakingDepositServiceEth.name);
      throw new NotFoundException("stakingRuleNotFound");
    }

    let depositAssetId;

    if (tokenIds.length > 0) {
      const newAssetEntity = await this.assetService.create();
      depositAssetId = newAssetEntity.id;
      const depositComponets = [];

      for (let i = 0; i < tokenIds.length; i++) {
        const tokenId = tokenIds[i];
        // TODO we must be sure to sort components same order in rule and contract
        const tokenEntity = await this.tokenService.getToken(
          tokenId,
          // stakingRuleEntity.deposit.components.filter(comp => comp.tokenType === TokenType.ERC721)[i].contract.address,
          stakingRuleEntity.deposit.components[i].contract.address,
        );

        if (!tokenEntity) {
          this.loggerService.error("depositTokenNotFound", tokenId, StakingDepositServiceEth.name);
          throw new NotFoundException("depositTokenNotFound");
        }

        depositComponets.push({
          tokenType: tokenEntity.template.contract.contractType!,
          contractId: tokenEntity.template.contractId,
          templateId: tokenEntity.templateId,
          tokenId: tokenEntity.id,
          amount: stakingRuleEntity.deposit.components[i].amount,
        });

        // TODO should we add a new type DEPOSIT?
        // await this.assetService.createAssetHistory({
        //   exchangeType: ExchangeType.PRICE,
        //   historyId: historyEntity.id,
        //   contractId: tokenEntity.template.contractId,
        //   tokenId: tokenEntity.id,
        //   amount: stakingRuleEntity.deposit.components[i].amount,
        // });
      }

      await this.assetService.createAsset(newAssetEntity, depositComponets);
    }

    const stakingDepositEntity = await this.stakingDepositService.create({
      account: owner.toLowerCase(),
      externalId: stakingId,
      startTimestamp: new Date(Number(startTimestamp) * 1000).toISOString(),
      stakingRuleId: stakingRuleEntity.id,
      stakingRule: stakingRuleEntity,
      depositAssetId,
    });

    await this.notificatorService.stakingDepositStart({
      stakingDeposit: stakingDepositEntity,
      address,
      transactionHash,
    });

    await this.signalClientProxy
      .emit(SignalEventType.TRANSACTION_HASH, {
        account: owner.toLowerCase(),
        transactionHash,
        transactionType: name,
      })
      .toPromise();

    // check balances
    await this.checkStakingDepositBalance(stakingRuleEntity.contract);
  }

  public async depositWithdraw(event: ILogEvent<IStakingDepositWithdrawEvent>, context: Log): Promise<void> {
    const {
      name,
      args: { stakingId, owner, withdrawTimestamp },
    } = event;
    const { address, transactionHash } = context;

    const stakingDepositEntity = await this.stakingDepositService.findOne(
      { externalId: stakingId, stakingRule: { contract: { address: address.toLowerCase() } } },
      { relations: { stakingRule: { contract: true } } },
    );

    if (!stakingDepositEntity) {
      this.loggerService.error("stakingDepositNotFound", stakingId, StakingDepositServiceEth.name);
      throw new NotFoundException("stakingDepositNotFound");
    }

    await this.eventHistoryService.updateHistory(event, context);

    // Deactivate current deposit
    Object.assign(stakingDepositEntity, {
      stakingDepositStatus: StakingDepositStatus.CANCELED,
      withdrawTimestamp: new Date(Number(withdrawTimestamp) * 1000).toISOString(),
    });
    await stakingDepositEntity.save();

    // NOTIFY MERCHANT ABOUT WITHDRAW
    await this.notificatorService.stakingDepositFinish({
      stakingDeposit: stakingDepositEntity,
      address,
      transactionHash,
    });

    // SIGNAL TO STAKE OWNER ABOUT WITHDRAW
    await this.signalClientProxy
      .emit(SignalEventType.TRANSACTION_HASH, {
        account: owner.toLowerCase(),
        transactionHash,
        transactionType: name,
      })
      .toPromise();

    // check balances
    await this.checkStakingDepositBalance(stakingDepositEntity.stakingRule.contract);
    // TODO save penalty to asset
  }

  public async depositReturn(event: ILogEvent<IStakingDepositReturnEvent>, context: Log): Promise<void> {
    const {
      name,
      args: { stakingId, owner },
    } = event;
    const { address, transactionHash } = context;

    const stakingDepositEntity = await this.stakingDepositService.findOne(
      { externalId: stakingId, stakingRule: { contract: { address: address.toLowerCase() } } },
      { relations: { stakingRule: { contract: true } } },
    );

    if (!stakingDepositEntity) {
      this.loggerService.error("stakingDepositNotFound", stakingId, StakingDepositServiceEth.name);
      throw new NotFoundException("stakingDepositNotFound");
    }

    await this.eventHistoryService.updateHistory(event, context);

    // WE DO NOT CHANGE DEPOSIT STATUS HERE, IT WILL BE SET TO 'CANCELED' IN WITHDRAW EVENT

    // TODO merchant notification!!!

    await this.signalClientProxy
      .emit(SignalEventType.TRANSACTION_HASH, {
        account: owner.toLowerCase(),
        transactionHash,
        transactionType: name,
      })
      .toPromise();

    // check balances
    await this.checkStakingDepositBalance(stakingDepositEntity.stakingRule.contract);
    // TODO penalty = most likely 0 but not always
  }

  public async depositFinish(event: ILogEvent<IStakingDepositFinishEvent>, context: Log): Promise<void> {
    const {
      name,
      args: { stakingId, owner, multiplier, finishTimestamp },
    } = event;
    const { address, transactionHash } = context;

    await this.eventHistoryService.updateHistory(event, context);

    const stakingDepositEntity = await this.stakingDepositService.findOne({
      externalId: stakingId,
    });

    if (!stakingDepositEntity) {
      throw new NotFoundException("stakingDepositNotFound");
    }

    // Complete current deposit
    Object.assign(stakingDepositEntity, {
      stakingDepositStatus: StakingDepositStatus.COMPLETE,
      withdrawTimestamp: new Date(Number(finishTimestamp) * 1000).toISOString(),
      multiplier: Number(multiplier),
    });
    await stakingDepositEntity.save();

    await this.notificatorService.stakingDepositFinish({
      stakingDeposit: stakingDepositEntity,
      address,
      transactionHash,
    });

    await this.signalClientProxy
      .emit(SignalEventType.TRANSACTION_HASH, {
        account: owner.toLowerCase(),
        transactionHash,
        transactionType: name,
      })
      .toPromise();

    // check balances
    await this.checkStakingDepositBalance(stakingDepositEntity.stakingRule.contract);
  }

  public async depositPenalty(event: ILogEvent<IStakingPenaltyEvent>, context: Log): Promise<void> {
    const {
      name,
      args: { stakingId, item },
    } = event;
    const { tokenType, token, tokenId, amount } = item;
    const { address, transactionHash } = context;

    // CHECK DEPOSIT
    const stakingDepositEntity = await this.stakingDepositService.findOne(
      { externalId: stakingId, stakingRule: { contract: { address: address.toLowerCase() } } },
      { relations: { stakingRule: { contract: { merchant: true } } } },
    );

    if (!stakingDepositEntity) {
      this.loggerService.error("stakingDepositNotFound", stakingId, StakingDepositServiceEth.name);
      throw new NotFoundException("stakingDepositNotFound");
    }

    await this.eventHistoryService.updateHistory(event, context);

    // FIND EXISTING PENALTY
    const penaltyEntity = await this.penaltyService.findOne(
      { stakingId: stakingDepositEntity.stakingRule.contractId },
      { relations: { penalty: { components: { template: true, contract: true } }, staking: { merchant: true } } },
    );

    const isNft =
      Object.values(TokenType)[Number(tokenType)] === TokenType.ERC721 ||
      Object.values(TokenType)[Number(tokenType)] === TokenType.ERC998;

    let penaltyTemplate: TemplateEntity | null;
    let penaltyToken: TokenEntity | null = null;

    // FIND PENALTY TEMPLATE OR TOKEN (for ERC721 and ERC998)
    if (isNft) {
      penaltyToken = await this.tokenService.getToken(tokenId, token.toLowerCase());
      if (!penaltyToken) {
        throw new NotFoundException("penaltyTokenNotFound");
      }
      penaltyTemplate = penaltyToken.template;
    } else {
      penaltyTemplate = await this.templateService.findOne({ id: Number(tokenId) }, { relations: { contract: true } });
    }

    if (!penaltyTemplate) {
      throw new NotFoundException("penaltyTemplateNotFound");
    }

    // CREATE or UPDATE PENALTY ASSET
    if (penaltyEntity) {
      // update old penalty asset
      const oldAssetEntity = penaltyEntity.penalty;
      await this.assetService.updateAsset(oldAssetEntity, {
        tokenType: penaltyTemplate.contract.contractType!,
        contractId: penaltyTemplate.contractId,
        templateId: penaltyTemplate.id,
        tokenId: isNft ? penaltyToken!.id : null,
        amount,
      });
    } else {
      // create new penalty asset
      const newAssetEntity = await this.assetService.create();
      await this.assetService.createAsset(newAssetEntity, [
        {
          tokenType: penaltyTemplate.contract.contractType!,
          contractId: penaltyTemplate.contractId,
          templateId: penaltyTemplate.id,
          tokenId: isNft ? penaltyToken!.id : null,
          amount,
        },
      ]);
      // create penalty
      await this.penaltyService.create({
        stakingId: stakingDepositEntity.stakingRule.contractId,
        penaltyId: newAssetEntity.id,
      });
    }

    // SIGNAL TO MERCHANT ABOUT PENALTY
    await this.signalClientProxy
      .emit(SignalEventType.TRANSACTION_HASH, {
        account: stakingDepositEntity.stakingRule.contract.merchant.wallet.toLowerCase(),
        transactionHash,
        transactionType: name,
      })
      .toPromise();

    // TODO NOTIFY MERCHANT ABOUT PENALTY
    // await this.notificatorService.stakingDepositStart({
    //   stakingDeposit: stakingDepositEntity,
    //   address,
    //   transactionHash,
    // });

    // check balances
    await this.checkStakingDepositBalance(stakingDepositEntity.stakingRule.contract);
  }

  public async checkStakingDepositBalance(staking: ContractEntity): Promise<void> {
    const { id, address } = staking;
    const contractId = id;
    // GET ALL ACTIVE DEPOSITS FOR STAKING CONTRACT WITH DEPOSIT ASSET TOKEN_TYPES: NATIVE,ERC20
    const stakingDeposits = await this.stakingDepositService.findAll(
      {
        stakingDepositStatus: StakingDepositStatus.ACTIVE,
        stakingRule: {
          contractId,
          deposit: { components: { tokenType: Any([TokenType.NATIVE, TokenType.ERC20]) } },
        },
      },
      {
        relations: {
          stakingRule: { contract: { merchant: true }, deposit: { components: { contract: { merchant: true } } } },
        },
      },
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
      const promises = depositAssetContracts.map(async addr => {
        const currentAssetBalance = stakingBalances.filter(bal => bal.token.template.contract.address === addr);
        if (currentAssetBalance.length > 0) {
          const { amount, token } = currentAssetBalance[0];
          const { templateId } = token;
          const depSum = this.getDepositAssetTemplateSum(stakingDeposits, templateId);

          // NOTIFY ABOUT TOP UP
          // TODO get threshold from merchant
          const diff = BigInt(amount) - depSum;
          const threshold = BigInt(10); // 10%
          if (diff / (BigInt(amount) / BigInt(100)) >= threshold) {
            const notifyData = {
              stakingContract: staking,
              token,
              depositAmount: depSum.toString(),
              stakingBalance: amount,
            };
            await this.notificatorService.stakingBalanceCheck(notifyData);
            this.loggerService.warn("STAKING_BALANCE_CHECK", notifyData, StakingDepositServiceEth.name);

            console.info("STAKING", contractId, address);
            console.info("TOKEN", token.template.title, token.template.contract.address);
            console.info("NEED TOP UP AMOUNT", depSum - BigInt(amount));

            // NOTIFY EMAIL
            await this.emailClientProxy
              .emit(EmailType.STAKING_BALANCE, {
                staking,
                token,
                balance: amount,
                deposit: depSum.toString(),
              })
              .toPromise();
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

      await Promise.allSettled(promises).then(res =>
        res.forEach(value => {
          if (value.status === "rejected") {
            this.loggerService.error(value.reason, StakingDepositServiceEth.name);
          }
        }),
      );
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
