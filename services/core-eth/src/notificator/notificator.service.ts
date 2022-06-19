import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { constants } from "ethers";

import { GameType, RmqProviderType } from "@framework/types";

@Injectable()
export class NotificatorService {
  constructor(@Inject(RmqProviderType.NOTIFICATOR_SERVICE) private client: ClientProxy) {}

  public dummy(): void {
    this.client.emit(GameType.DUMMY, {
      from: constants.AddressZero,
      to: constants.AddressZero,
      value: constants.WeiPerEther,
      transactionHash: constants.HashZero,
    });
  }
}
