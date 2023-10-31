import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";

import { Log } from "ethers";
import type { ILogEvent } from "@gemunion/nest-js-module-ethers-gcp";
import type {
  IAssetDto,
  IStakingDepositFinishEvent,
  IStakingDepositReturnEvent,
  IStakingDepositStartEvent,
  IStakingDepositWithdrawEvent,
  IStakingPenaltyEvent,
} from "@framework/types";

import { NotificatorService } from "../../../../game/notificator/notificator.service";
import { EventHistoryService } from "../../../event-history/event-history.service";
import { StakingRulesService } from "../rules/rules.service";
import { StakingDepositService } from "./deposit.service";
import { RmqProviderType, SignalEventType, StakingDepositStatus } from "@framework/types";
import { AssetService } from "../../../exchange/asset/asset.service";
import { AssetEntity } from "../../../exchange/asset/asset.entity";
import { StakingPenaltyService } from "../penalty/penalty.service";
import { TemplateService } from "../../../hierarchy/template/template.service";

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

  public async penalty(event: ILogEvent<IStakingPenaltyEvent>, context: Log): Promise<void> {
    const {
      name,
      args: { stakingId, item },
    } = event;
    const { /* tokenType  token, */ tokenId, amount } = item;
    const { address, transactionHash } = context;

    const stakingDepositEntity = await this.stakingDepositService.findOne(
      { externalId: stakingId, stakingRule: { contract: { address: address.toLowerCase() } } },
      { relations: { stakingRule: { contract: { merchant: true } } } },
    );

    if (!stakingDepositEntity) {
      this.loggerService.error("stakingDepositNotFound", stakingId, StakingDepositServiceEth.name);
      throw new NotFoundException("stakingDepositNotFound");
    }

    await this.eventHistoryService.updateHistory(event, context, void 0, stakingDepositEntity.stakingRule.contractId);

    // FIND EXISTING DEPOSIT'S PENALTY
    const penaltyEntity = await this.penaltyService.findOne(
      { stakingId: stakingDepositEntity.stakingRule.contractId },
      { relations: { penalty: { components: { template: true, contract: true } }, staking: { merchant: true } } },
    );

    // FIND PENALTY ITEM TEMPLATE
    const penaltyTemplate = await this.templateService.findOne(
      { id: Number(tokenId) },
      { relations: { contract: true } },
    );
    // const penaltyToken = await this.tokenService.getToken(tokenId, token.toLowerCase());

    if (!penaltyTemplate) {
      throw new NotFoundException("penaltyTemplateNotFound");
    }

    // CREATE or UPDATE PENALTY ASSET
    if (!penaltyEntity) {
      // create
      const penaltyAssetEntity = await this.createEmptyAsset();
      const penaltyAsset: IAssetDto = {
        components: [
          {
            tokenType: penaltyTemplate.contract.contractType!,
            contractId: penaltyTemplate.contractId,
            templateId: penaltyTemplate.id,
            amount,
          },
        ],
      };
      await this.updateAsset(penaltyAssetEntity, penaltyAsset);
      await this.penaltyService.create({
        stakingId: stakingDepositEntity.stakingRule.contractId,
        penaltyId: penaltyAssetEntity.id,
      });
    } else {
      // update
      const penaltyAssetEntity = penaltyEntity.penalty;
      const penaltyAsset: IAssetDto = {
        components: penaltyAssetEntity.components.map(item => {
          return {
            id: item.id,
            tokenType: item.contract.contractType!,
            contractId: item.contractId,
            templateId: item.templateId,
            amount: item.amount,
          };
        }),
      };
      // TODO better update amounts if more same components exist?
      // TODO TEST 721 penalty!!!
      const componentsToUpdate = penaltyAsset.components.filter(item => item.templateId === penaltyTemplate.id);
      if (componentsToUpdate.length > 0) {
        const updatedAsset = penaltyAsset.components.map(comp => {
          if (comp.templateId === penaltyTemplate.id) {
            return Object.assign(comp, { amount: (BigInt(comp.amount) + BigInt(amount)).toString() });
          } else return comp;
        });
        await this.updateAsset(penaltyAssetEntity, { components: updatedAsset });
      } else {
        penaltyAsset.components.push({
          tokenType: penaltyTemplate.contract.contractType!,
          contractId: penaltyTemplate.contractId,
          templateId: penaltyTemplate.id,
          amount,
        });
        await this.updateAsset(penaltyAssetEntity, penaltyAsset);
      }
    }

    // TODO NOTIFY MERCHANT ABOUT PENALTY
    // await this.notificatorService.stakingDepositStart({
    //   stakingDeposit: stakingDepositEntity,
    //   address,
    //   transactionHash,
    // });

    // SIGNAL TO MERCHANT ABOUT PENALTY
    await this.signalClientProxy
      .emit(SignalEventType.TRANSACTION_HASH, {
        account: stakingDepositEntity.stakingRule.contract.merchant.wallet.toLowerCase(),
        transactionHash,
        transactionType: name,
      })
      .toPromise();
  }

  public async createEmptyAsset(): Promise<AssetEntity> {
    return this.assetService.create();
  }

  public async updateAsset(asset: AssetEntity, dto: IAssetDto): Promise<void> {
    await this.assetService.update(asset, dto);
  }
}
