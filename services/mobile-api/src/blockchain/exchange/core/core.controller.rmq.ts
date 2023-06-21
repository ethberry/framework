import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";

import { MobileEventType } from "@framework/types";

import type { IRmqPurchase } from "./core.service";
import { CoreService } from "./core.service";

@Controller()
export class CoreControllerRmq {
  constructor(private readonly claimService: CoreService) {}

  @MessagePattern(MobileEventType.PURCHASE)
  public purchase(@Payload() dto: IRmqPurchase): Promise<void> {
    return this.claimService.purchase(dto);
  }
}
