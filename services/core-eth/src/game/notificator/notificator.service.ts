import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { constants } from "ethers";

import { GameEventType, RmqProviderType } from "@framework/types";

@Injectable()
export class NotificatorService {
  constructor(@Inject(RmqProviderType.MOBILE_SERVICE) private mobileClient: ClientProxy) {}

  public dummy(): void {
    this.mobileClient.emit(GameEventType.DUMMY, {
      from: constants.AddressZero,
      to: constants.AddressZero,
      value: constants.WeiPerEther,
      transactionHash: constants.HashZero,
    });
  }
}
