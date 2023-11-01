import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";

import { Log } from "ethers";
import type { ILogEvent } from "@gemunion/nest-js-module-ethers-gcp";
import type {
  IStakingDepositWithdrawEvent,
  IStakingDepositFinishEvent,
  IStakingDepositReturnEvent,
  IStakingDepositStartEvent,
  IStakingPenaltyEvent,
} from "@framework/types";
import { RmqProviderType, SignalEventType, StakingDepositStatus } from "@framework/types";

import { NotificatorService } from "../../../../game/notificator/notificator.service";
import { EventHistoryService } from "../../../event-history/event-history.service";
import { TemplateService } from "../../../hierarchy/template/template.service";
import { AssetService } from "../../../exchange/asset/asset.service";
import { StakingPenaltyService } from "../penalty/penalty.service";
import { StakingRulesService } from "../rules/rules.service";
import { StakingDepositService } from "./deposit.service";

@Injectable()
export class StakingDepositServiceEth {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    @Inject(RmqProviderType.SIGNAL_SERVICE)
    protected readonly signalClientProxy: ClientProxy,
    private readonly stakingRulesService: StakingRulesService,
    private readonly stakingDepositService: StakingDepositService,
    private readonly eventHistoryService: EventHistoryService,
    private readonly notificatorService: NotificatorService,
    protected readonly assetService: AssetService,
    private readonly templateService: TemplateService,
    private readonly penaltyService: StakingPenaltyService,
  ) {}

  public async depositStart(event: ILogEvent<IStakingDepositStartEvent>, context: Log): Promise<void> {
    // emit StakingStart(stakeId, ruleId, _msgSender(), block.timestamp, tokenId);
    await this.eventHistoryService.updateHistory(event, context);
    const {
      name,
      args: { stakingId, ruleId, owner, startTimestamp },
    } = event;
    const { address, transactionHash } = context;

    const stakingRuleEntity = await this.stakingRulesService.findOne(
      { externalId: ruleId, contract: { address: address.toLowerCase() } },
      { relations: { contract: true } },
    );

    if (!stakingRuleEntity) {
      this.loggerService.error("stakingRuleNotFound", ruleId, StakingDepositServiceEth.name);
      throw new NotFoundException("stakingRuleNotFound");
    }

    const stakingDepositEntity = await this.stakingDepositService.create({
      account: owner.toLowerCase(),
      externalId: stakingId,
      startTimestamp: new Date(Number(startTimestamp) * 1000).toISOString(),
      stakingRuleId: stakingRuleEntity.id,
      stakingRule: stakingRuleEntity,
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

    await this.eventHistoryService.updateHistory(event, context, void 0, stakingDepositEntity.stakingRule.contractId);

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

    await this.eventHistoryService.updateHistory(event, context, void 0, stakingDepositEntity.stakingRule.contractId);

    // WE DO NOT CHANGE DEPOSIT STATUS HERE, IT WILL BE SET TO 'CANCELED' IN WITHDRAW EVENT

    // TODO merchant notification!!!

    await this.signalClientProxy
      .emit(SignalEventType.TRANSACTION_HASH, {
        account: owner.toLowerCase(),
        transactionHash,
        transactionType: name,
      })
      .toPromise();

    // TODO penalty = most likely 0 but not always
  }

  public async depositFinish(event: ILogEvent<IStakingDepositFinishEvent>, context: Log): Promise<void> {
    const {
      name,
      args: { stakingId, owner },
    } = event;
    const { address, transactionHash } = context;

    await this.eventHistoryService.updateHistory(event, context);

    const stakingDepositEntity = await this.stakingDepositService.findOne({
      externalId: stakingId,
    });

    if (!stakingDepositEntity) {
      throw new NotFoundException("stakingDepositNotFound");
    }

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
  }

  public async depositPenalty(event: ILogEvent<IStakingPenaltyEvent>, context: Log): Promise<void> {
    const {
      name,
      args: { stakingId, item },
    } = event;
    const { /* tokenType, token, */ tokenId, amount } = item;
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

    await this.eventHistoryService.updateHistory(event, context, void 0, stakingDepositEntity.stakingRule.contractId);

    // FIND EXISTING PENALTY
    const penaltyEntity = await this.penaltyService.findOne(
      { stakingId: stakingDepositEntity.stakingRule.contractId },
      { relations: { penalty: { components: { template: true, contract: true } }, staking: { merchant: true } } },
    );

    // FIND PENALTY TEMPLATE
    const penaltyTemplate = await this.templateService.findOne(
      { id: Number(tokenId) },
      { relations: { contract: true } },
    );

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
        amount,
      });
    } else {
      // create new penalty asset
      const newAssetEntity = await this.assetService.create();
      await this.assetService.createAsset(newAssetEntity, {
        tokenType: penaltyTemplate.contract.contractType!,
        contractId: penaltyTemplate.contractId,
        templateId: penaltyTemplate.id,
        amount,
      });
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
  }
}
