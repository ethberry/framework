import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";

import { MobileEventType, RmqProviderType } from "@framework/types";
import { IClaimData, IGradeData, IPurchaseData, IRentData, IStakingFinishData, IStakingStartData } from "./interfaces";

@Injectable()
export class NotificatorService {
  constructor(
    @Inject(RmqProviderType.MOBILE_SERVICE)
    private mobileClientProxy: ClientProxy,
  ) {}

  public purchase(data: IPurchaseData): void {
    this.mobileClientProxy.emit(MobileEventType.PURCHASE, data);
  }

  public claim(data: IClaimData): void {
    this.mobileClientProxy.emit(MobileEventType.CLAIM, data);
  }

  public rent(data: IRentData): void {
    this.mobileClientProxy.emit(MobileEventType.RENT, data);
  }

  public grade(data: IGradeData): void {
    this.mobileClientProxy.emit(MobileEventType.UPGRADE, data);
  }

  public stakingStart(data: IStakingStartData): void {
    this.mobileClientProxy.emit(MobileEventType.STAKING_START, data);
  }

  public stakingFinish(data: IStakingFinishData): void {
    this.mobileClientProxy.emit(MobileEventType.STAKING_FINISH, data);
  }
}
