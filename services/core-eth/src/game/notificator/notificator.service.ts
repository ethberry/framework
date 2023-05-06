import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { ZeroAddress, WeiPerEther, ZeroHash } from "ethers";

import { GameEventType, RmqProviderType } from "@framework/types";

interface IDummyData {
  eventType: any;
  data: Record<string, any>;
}

@Injectable()
export class NotificatorService {
  constructor(@Inject(RmqProviderType.MOBILE_SERVICE) private mobileClient: ClientProxy) {}

  public dummy(): void {
    this.mobileClient.emit(GameEventType.DUMMY, {
      from: ZeroAddress,
      to: ZeroAddress,
      value: WeiPerEther,
      transactionHash: ZeroHash,
    });
  }

  public dummyUser(data: any): void {
    this.mobileClient.emit(GameEventType.DUMMY, data);
  }
}
