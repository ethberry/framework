import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { ConfigService } from "@nestjs/config";

import { Log } from "ethers";

import type { ILogEvent } from "@gemunion/nest-js-module-ethers-gcp";
import {
  IReferralEvent,
  IReferralRewardEvent,
  IReferralWithdrawEvent,
  RmqProviderType,
  SignalEventType,
} from "@framework/types";
import { testChainId } from "@framework/constants";
import { ReferralService } from "./referral.service";
import { ContractService } from "../../hierarchy/contract/contract.service";
import { EventHistoryService } from "../../event-history/event-history.service";
import { TokenService } from "../../hierarchy/token/token.service";
import { AssetService } from "../../exchange/asset/asset.service";
import { NotificatorService } from "../../../game/notificator/notificator.service";
import { AssetEntity } from "../../exchange/asset/asset.entity";

@Injectable()
export class ReferralServiceEth {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    @Inject(RmqProviderType.SIGNAL_SERVICE)
    protected readonly signalClientProxy: ClientProxy,
    private readonly configService: ConfigService,
    private readonly referralService: ReferralService,
    private readonly eventHistoryService: EventHistoryService,
    private readonly contractService: ContractService,
    private readonly tokenService: TokenService,
    private readonly assetService: AssetService,
    private readonly notificatorService: NotificatorService,
  ) {}

  public async refEvent(event: ILogEvent<IReferralEvent>, context: Log): Promise<void> {
    const { address, transactionHash } = context;
    const { name, args } = event;
    const { account, price } = args;

    const chainId = ~~this.configService.get<number>("CHAIN_ID", Number(testChainId));

    const contractEntity = await this.contractService.findOne({ chainId, address: address.toLowerCase() });

    if (!contractEntity) {
      throw new NotFoundException("contractNotFound");
    }

    await this.eventHistoryService.updateHistory(event, context, void 0, contractEntity.id);

    let assetEntity: AssetEntity | null = null;
    let referralAssetId;

    if (price.length > 0) {
      const newAssetEntity = await this.assetService.create();
      referralAssetId = newAssetEntity.id;
      const depositComponets = [];
      for (const item of price) {
        const { token, tokenId, amount } = item;

        const tokenEntity = await this.tokenService.getToken(tokenId, token.toLowerCase(), chainId);

        if (!tokenEntity) {
          this.loggerService.error("priceTokenNotFound", tokenId, ReferralServiceEth.name);
          throw new NotFoundException("priceTokenNotFound");
        }

        depositComponets.push({
          tokenType: tokenEntity.template.contract.contractType!,
          contractId: tokenEntity.template.contractId,
          templateId: tokenEntity.templateId,
          tokenId: tokenEntity.id,
          amount,
        });
      }

      await this.assetService.createAsset(newAssetEntity, depositComponets);

      assetEntity = await this.assetService.findOneWithRelations({ id: referralAssetId });

      if (!assetEntity) {
        throw new NotFoundException("assetNotFound");
      }
    }

    // NOTIFY GAME
    await this.notificatorService.referralEvent({
      account,
      contract: contractEntity,
      price: assetEntity,
      transactionHash,
    });

    await this.signalClientProxy
      .emit(SignalEventType.TRANSACTION_HASH, {
        account: account.toLowerCase(),
        transactionHash,
        transactionType: name,
      })
      .toPromise();
  }

  public async reward(event: ILogEvent<IReferralRewardEvent>, context: Log): Promise<void> {
    const { transactionHash } = context;
    const { name, args } = event;
    const { account, token } = args;

    const chainId = ~~this.configService.get<number>("CHAIN_ID", Number(testChainId));

    const tokenContractEntity = await this.contractService.findOne({ chainId, address: token });

    if (!tokenContractEntity) {
      throw new NotFoundException("contractNotFound");
    }

    await this.eventHistoryService.updateHistory(event, context);

    await this.referralService.create({ contractId: tokenContractEntity.id, ...args });

    await this.signalClientProxy
      .emit(SignalEventType.TRANSACTION_HASH, {
        account: account.toLowerCase(),
        transactionHash,
        transactionType: name,
      })
      .toPromise();
  }

  public async withdraw(event: ILogEvent<IReferralWithdrawEvent>, context: Log): Promise<void> {
    await this.eventHistoryService.updateHistory(event, context);
  }
}
