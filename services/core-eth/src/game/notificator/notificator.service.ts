import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { constants } from "ethers";

import { GameEventType, RmqProviderType } from "@framework/types";

@Injectable()
export class NotificatorService {
  constructor(@Inject(RmqProviderType.MOBILE_SERVICE) private mobileClient: ClientProxy) {}

  public dummy(data?: any): void {
    this.mobileClient.emit(
      GameEventType.DUMMY,
      data || {
        from: constants.AddressZero,
        to: constants.AddressZero,
        value: constants.WeiPerEther,
        transactionHash: constants.HashZero,
      },
    );
  }
}
