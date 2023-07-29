import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { ClientProxy, ClientProxyFactory, Transport } from "@nestjs/microservices";
import { ConfigService } from "@nestjs/config";

import { MobileEventType } from "@framework/types";

import { MerchantService } from "../../infrastructure/merchant/merchant.service";
import type {
  IBatchTransferData,
  IClaimData,
  IGradeData,
  IPurchaseData,
  IPurchaseRandomData,
  IRentUserUpdateData,
  IRoundEndLotteryData,
  IRoundEndRaffleData,
  IRoundStartRaffleData,
  IStakingDepositFinishData,
  IStakingDepositStartData,
  IStakingRuleCreatedData,
  IStakingRuleUpdatedData,
  IWaitListRewardClaimedData,
  IWaitListRewardSetData,
} from "./interfaces";
import { IUnpackMysteryData } from "./interfaces/mystery-box";
import {
  ICraftData,
  IFinalizeLotteryData,
  IFinalizeRaffleData,
  IPrizeRaffleData,
  IPurchaseRaffleData,
  IRoundStartLotteryData,
  IVestingReleaseData,
  ITokenTransferData,
} from "./interfaces";

@Injectable()
export class NotificatorService {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly configService: ConfigService,
    private readonly merchantService: MerchantService,
  ) {}

  private async getClientProxyForMerchant(merchantId: number) {
    const merchantEntity = await this.merchantService.findOne({ id: merchantId });
    if (!merchantEntity) {
      throw new NotFoundException("merchantNotFound");
    }

    const rmqUrl = this.configService.get<string>("RMQ_URL", "amqp://127.0.0.1:5672/");
    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [rmqUrl],
        queue: merchantId.toString(),
        queueOptions: {
          durable: false,
        },
      },
    });
  }

  private sendMessage(merchantId: number, fn: (clientProxy: ClientProxy) => Promise<any>) {
    return this.getClientProxyForMerchant(merchantId)
      .then(fn)
      .catch(e => {
        this.loggerService.error(e, NotificatorService.name);
      });
  }

  // TRANSFER
  public tokenTransfer(data: ITokenTransferData): Promise<any> {
    return this.sendMessage(data.token.template!.contract!.merchantId, clientProxy => {
      return clientProxy.emit(MobileEventType.TOKEN_TRANSFER, data).toPromise();
    });
  }

  public batchTransfer(data: IBatchTransferData): Promise<any> {
    return this.sendMessage(data.tokens[0].template!.contract!.merchantId, clientProxy => {
      return clientProxy.emit(MobileEventType.BATCH_TRANSFER, data).toPromise();
    });
  }

  // MODULE:RENT
  public updateUser(data: IRentUserUpdateData): Promise<any> {
    return this.sendMessage(data.merchantId, clientProxy => {
      return clientProxy.emit(MobileEventType.RENT_USER, data).toPromise();
    });
  }

  // MODULE:CORE
  public purchase(data: IPurchaseData): Promise<any> {
    return this.sendMessage(data.items.at(0)!.contract!.merchantId, clientProxy => {
      return clientProxy.emit(MobileEventType.PURCHASE, data).toPromise();
    });
  }

  public purchaseRandom(data: IPurchaseRandomData): Promise<any> {
    return this.sendMessage(data.item.contract!.merchantId, clientProxy => {
      return clientProxy.emit(MobileEventType.PURCHASE_RANDOM, data).toPromise();
    });
  }

  // MODULE:MYSTERY
  public purchaseMystery(data: IPurchaseData): Promise<any> {
    return this.sendMessage(data.items.at(0)!.contract!.merchantId, clientProxy => {
      return clientProxy.emit(MobileEventType.PURCHASE_MYSTERY, data).toPromise();
    });
  }

  public unpackMystery(data: IUnpackMysteryData): Promise<any> {
    return this.sendMessage(data.items.at(0)!.contract!.merchantId, clientProxy => {
      return clientProxy.emit(MobileEventType.PURCHASE_MYSTERY, data).toPromise();
    });
  }

  // MODULE:CLAIM
  public async claim(data: IClaimData): Promise<any> {
    return this.sendMessage(data.claim.merchantId, clientProxy => {
      return clientProxy.emit(MobileEventType.CLAIM, data).toPromise();
    });
  }

  // MODULE:CRAFT
  public async craft(data: ICraftData): Promise<any> {
    return this.sendMessage(data.craft.merchantId, clientProxy => {
      return clientProxy.emit(MobileEventType.CLAIM, data).toPromise();
    });
  }

  // MODULE:WAITLIST
  public async rewardSet(data: IWaitListRewardSetData): Promise<any> {
    return this.sendMessage(data.waitListList.contract.merchantId, clientProxy => {
      return clientProxy.emit(MobileEventType.WAITLIST_REWARD_SET, data).toPromise();
    });
  }

  public async rewardClaimed(data: IWaitListRewardClaimedData): Promise<any> {
    return this.sendMessage(data.waitListItem.list!.contract.merchantId, clientProxy => {
      return clientProxy.emit(MobileEventType.WAITLIST_REWARD_CLAIMED, data).toPromise();
    });
  }

  // MODULE:GRADE
  public grade(data: IGradeData): Promise<any> {
    return this.sendMessage(data.grade.contract!.merchantId, clientProxy => {
      return clientProxy.emit(MobileEventType.UPGRADE, data).toPromise();
    });
  }

  // MODULE:STAKING
  public stakingDepositStart(data: IStakingDepositStartData): Promise<any> {
    return this.sendMessage(data.stakingDeposit.stakingRule!.contract!.merchantId, clientProxy => {
      return clientProxy.emit(MobileEventType.STAKING_DEPOSIT_START, data).toPromise();
    });
  }

  public stakingDepositFinish(data: IStakingDepositFinishData): Promise<any> {
    return this.sendMessage(data.stakingDeposit.stakingRule!.contract!.merchantId, clientProxy => {
      return clientProxy.emit(MobileEventType.STAKING_DEPOSIT_FINISH, data).toPromise();
    });
  }

  public stakingRuleCreated(data: IStakingRuleCreatedData): Promise<any> {
    return this.sendMessage(data.stakingRule.contract!.merchantId, clientProxy => {
      return clientProxy.emit(MobileEventType.STAKING_RULE_CREATED, data).toPromise();
    });
  }

  public stakingRuleUpdated(data: IStakingRuleUpdatedData): Promise<any> {
    return this.sendMessage(data.stakingRule.contract!.merchantId, clientProxy => {
      return clientProxy.emit(MobileEventType.STAKING_RULE_UPDATED, data).toPromise();
    });
  }

  // MODULE:RAFFLE
  public purchaseRaffle(data: IPurchaseRaffleData): Promise<any> {
    return this.sendMessage(data.items.at(0)!.contract!.merchantId, clientProxy => {
      return clientProxy.emit(MobileEventType.PURCHASE_RAFFLE, data).toPromise();
    });
  }

  public finalizeRaffle(data: IFinalizeRaffleData): Promise<any> {
    return this.sendMessage(data.round.contract!.merchantId, clientProxy => {
      return clientProxy.emit(MobileEventType.FINALIZE_RAFFLE, data).toPromise();
    });
  }

  public prizeRaffle(data: IPrizeRaffleData): Promise<any> {
    return this.sendMessage(data.round.contract!.merchantId, clientProxy => {
      return clientProxy.emit(MobileEventType.PRIZE_RAFFLE, data).toPromise();
    });
  }

  public roundStartRaffle(data: IRoundStartRaffleData): Promise<any> {
    return this.sendMessage(data.round.contract!.merchantId, clientProxy => {
      return clientProxy.emit(MobileEventType.RAFFLE_ROUND_START, data).toPromise();
    });
  }

  public roundEndRaffle(data: IRoundEndRaffleData): Promise<any> {
    return this.sendMessage(data.round.contract!.merchantId, clientProxy => {
      return clientProxy.emit(MobileEventType.RAFFLE_ROUND_END, data).toPromise();
    });
  }

  // MODULE:LOTTERY
  public purchaseLottery(data: IPurchaseData): Promise<any> {
    return this.sendMessage(data.items.at(0)!.contract!.merchantId, clientProxy => {
      return clientProxy.emit(MobileEventType.PURCHASE_LOTTERY, data).toPromise();
    });
  }

  public finalizeLottery(data: IFinalizeLotteryData): Promise<any> {
    return this.sendMessage(data.round.contract!.merchantId, clientProxy => {
      return clientProxy.emit(MobileEventType.FINALIZE_LOTTERY, data).toPromise();
    });
  }

  public roundStartLottery(data: IRoundStartLotteryData): Promise<any> {
    return this.sendMessage(data.round.contract!.merchantId, clientProxy => {
      return clientProxy.emit(MobileEventType.LOTTERY_ROUND_START, data).toPromise();
    });
  }

  public roundEndLottery(data: IRoundEndLotteryData): Promise<any> {
    return this.sendMessage(data.round.contract!.merchantId, clientProxy => {
      return clientProxy.emit(MobileEventType.LOTTERY_ROUND_END, data).toPromise();
    });
  }

  // MODULE:VESTING
  public vestingRelease(data: IVestingReleaseData): Promise<any> {
    return this.sendMessage(data.vesting.merchantId, clientProxy => {
      return clientProxy.emit(MobileEventType.VESTING_RELEASED, data).toPromise();
    });
  }
}
