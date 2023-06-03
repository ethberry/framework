import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";

import { MobileEventType, RmqProviderType } from "@framework/types";
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
    @Inject(RmqProviderType.MOBILE_SERVICE)
    private mobileClientProxy: ClientProxy,
  ) {}

  // MODULE:CORE
  public purchase(data: IPurchaseData): void {
    this.mobileClientProxy.emit(MobileEventType.PURCHASE, data);
  }

  // MODULE:CLAIM
  public claim(data: IClaimData): void {
    this.mobileClientProxy.emit(MobileEventType.CLAIM, data);
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
