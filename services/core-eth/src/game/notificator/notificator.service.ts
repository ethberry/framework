import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { ClientProxy, ClientProxyFactory, Transport } from "@nestjs/microservices";
import { ConfigService } from "@nestjs/config";

import { MobileEventType } from "@framework/types";

import { MerchantService } from "../../infrastructure/merchant/merchant.service";
import type {
  IBatchTransferData,
  IBreedData,
  IClaimData,
  IConsecutiveTransferData,
  ICraftData,
  IDismantleData,
  IGradeData,
  ILotteryFinalizeData,
  ILotteryPrizeData,
  ILotteryPurchaseData,
  ILotteryRoundEndData,
  ILotteryRoundStartData,
  IMysteryPurchaseData,
  IMysteryUnpackData,
  IPurchaseData,
  IPurchaseRandomData,
  IRaffleFinalizeData,
  IRafflePrizeData,
  IRafflePurchaseData,
  IRaffleRoundEndData,
  IRaffleRoundStartData,
  IRentUserUpdateData,
  IStakingDepositFinishData,
  IStakingDepositStartData,
  IStakingRuleCreatedData,
  IStakingRuleUpdatedData,
  ITokenTransferData,
  IVestingReleaseData,
  IWaitListRewardClaimedData,
  IWaitListRewardSetData,
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

  public consecutiveTransfer(data: IConsecutiveTransferData): Promise<any> {
    return this.sendMessage(data.tokens[0].template!.contract!.merchantId, clientProxy => {
      return clientProxy.emit(MobileEventType.CONSECUTIVE_TRANSFER, data).toPromise();
    });
  }

  // MODULE:RENT
  public updateUser(data: IRentUserUpdateData): Promise<any> {
    return this.sendMessage(data.merchantId, clientProxy => {
      return clientProxy.emit(MobileEventType.RENT_USER, data).toPromise();
    });
  }

  // MODULE:EXCHANGE
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
  public purchaseMystery(data: IMysteryPurchaseData): Promise<any> {
    return this.sendMessage(data.items.at(0)!.contract!.merchantId, clientProxy => {
      return clientProxy.emit(MobileEventType.MYSTERY_PURCHASE, data).toPromise();
    });
  }

  public unpackMystery(data: IMysteryUnpackData): Promise<any> {
    return this.sendMessage(data.items.at(0)!.contract!.merchantId, clientProxy => {
      return clientProxy.emit(MobileEventType.MYSTERY_UNPACK, data).toPromise();
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
      return clientProxy.emit(MobileEventType.CRAFT, data).toPromise();
    });
  }

  // MODULE:DISMANTLE
  public async dismantle(data: IDismantleData): Promise<any> {
    return this.sendMessage(data.dismantle.merchantId, clientProxy => {
      return clientProxy.emit(MobileEventType.DISMANTLE, data).toPromise();
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
      return clientProxy.emit(MobileEventType.LEVEL_UP, data).toPromise();
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
  public rafflePurchase(data: IRafflePurchaseData): Promise<any> {
    return this.sendMessage(data.items.at(0)!.contract!.merchantId, clientProxy => {
      return clientProxy.emit(MobileEventType.RAFFLE_PURCHASE, data).toPromise();
    });
  }

  public raffleRoundStart(data: IRaffleRoundStartData): Promise<any> {
    return this.sendMessage(data.round.contract!.merchantId, clientProxy => {
      return clientProxy.emit(MobileEventType.RAFFLE_ROUND_START, data).toPromise();
    });
  }

  public raffleRoundEnd(data: IRaffleRoundEndData): Promise<any> {
    return this.sendMessage(data.round.contract!.merchantId, clientProxy => {
      return clientProxy.emit(MobileEventType.RAFFLE_ROUND_END, data).toPromise();
    });
  }

  public raffleFinalize(data: IRaffleFinalizeData): Promise<any> {
    return this.sendMessage(data.round.contract!.merchantId, clientProxy => {
      return clientProxy.emit(MobileEventType.RAFFLE_FINALIZE, data).toPromise();
    });
  }

  public rafflePrize(data: IRafflePrizeData): Promise<any> {
    return this.sendMessage(data.round.contract!.merchantId, clientProxy => {
      return clientProxy.emit(MobileEventType.RAFFLE_PRIZE, data).toPromise();
    });
  }

  // MODULE:LOTTERY
  public lotteryPurchase(data: ILotteryPurchaseData): Promise<any> {
    return this.sendMessage(data.items.at(0)!.contract!.merchantId, clientProxy => {
      return clientProxy.emit(MobileEventType.LOTTERY_PURCHASE, data).toPromise();
    });
  }

  public lotteryRoundStart(data: ILotteryRoundStartData): Promise<any> {
    return this.sendMessage(data.round.contract!.merchantId, clientProxy => {
      return clientProxy.emit(MobileEventType.LOTTERY_ROUND_START, data).toPromise();
    });
  }

  public lotteryRoundEnd(data: ILotteryRoundEndData): Promise<any> {
    return this.sendMessage(data.round.contract!.merchantId, clientProxy => {
      return clientProxy.emit(MobileEventType.LOTTERY_ROUND_END, data).toPromise();
    });
  }

  public lotteryFinalize(data: ILotteryFinalizeData): Promise<any> {
    return this.sendMessage(data.round.contract!.merchantId, clientProxy => {
      return clientProxy.emit(MobileEventType.LOTTERY_FINALIZE, data).toPromise();
    });
  }

  public lotteryPrize(data: ILotteryPrizeData): Promise<any> {
    return this.sendMessage(data.round.contract!.merchantId, clientProxy => {
      return clientProxy.emit(MobileEventType.LOTTERY_PRIZE, data).toPromise();
    });
  }

  // MODULE:VESTING
  public vestingRelease(data: IVestingReleaseData): Promise<any> {
    return this.sendMessage(data.vesting.merchantId, clientProxy => {
      return clientProxy.emit(MobileEventType.VESTING_RELEASED, data).toPromise();
    });
  }

  // MODULE:BREED
  public breed(data: IBreedData): Promise<any> {
    return this.sendMessage(data.items.at(0)!.contract!.merchantId, clientProxy => {
      return clientProxy.emit(MobileEventType.BREED, data).toPromise();
    });
  }
}
