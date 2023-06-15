import { Inject, Logger, Injectable, LoggerService, NotFoundException } from "@nestjs/common";
import { ClientProxy, ClientProxyFactory, Transport } from "@nestjs/microservices";
import { ConfigService } from "@nestjs/config";

import { MobileEventType, RmqProviderType } from "@framework/types";

import { MerchantService } from "../../infrastructure/merchant/merchant.service";
import {
  IClaimData,
  IGradeData,
  IPurchaseData,
  IRentData,
  IRentUserUpdateData,
  IStakingDepositFinishData,
  IStakingDepositStartData,
  IStakingRuleCreatedData,
  IStakingRuleUpdatedData,
} from "./interfaces";

@Injectable()
export class NotificatorService {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    @Inject(RmqProviderType.MOBILE_SERVICE)
    private mobileClientProxy: ClientProxy,
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

  // MODULE:CORE
  public purchase(data: IPurchaseData): void {
    this.mobileClientProxy.emit(MobileEventType.PURCHASE, data);
  }

  // MODULE:CLAIM
  public async claim(data: IClaimData): Promise<any> {
    return this.sendMessage(data.claim.merchantId, clientProxy => {
      return clientProxy.emit(MobileEventType.CLAIM, data).toPromise();
    });
  }

  // MODULE:RENTABLE
  public rent(data: IRentData): void {
    this.mobileClientProxy.emit(MobileEventType.RENT, data);
  }

  public updateUser(data: IRentUserUpdateData): void {
    this.mobileClientProxy.emit(MobileEventType.RENT_USER, data);
  }

  // MODULE:GRADE
  public grade(data: IGradeData): void {
    this.mobileClientProxy.emit(MobileEventType.UPGRADE, data);
  }

  // MODULE:STAKING
  public stakingDepositStart(data: IStakingDepositStartData): void {
    this.mobileClientProxy.emit(MobileEventType.STAKING_START, data);
  }

  public stakingDepositFinish(data: IStakingDepositFinishData): void {
    this.mobileClientProxy.emit(MobileEventType.STAKING_FINISH, data);
  }

  public stakingRuleCreated(data: IStakingRuleCreatedData): void {
    this.mobileClientProxy.emit(MobileEventType.STAKING_FINISH, data);
  }

  public stakingRuleUpdated(data: IStakingRuleUpdatedData): void {
    this.mobileClientProxy.emit(MobileEventType.STAKING_FINISH, data);
  }
}
