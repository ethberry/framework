import { EventPattern, Payload } from "@nestjs/microservices";
import { Controller } from "@nestjs/common";

import type { IMessage } from "@framework/types";
import { MobileEventType } from "@framework/types";

import { NotificatorService } from "./notificator.service";

@Controller()
export class NotificatorController {
  constructor(private notificatorService: NotificatorService) {}

  @EventPattern(MobileEventType.USER_CREATED)
  public registration(@Payload() data: IMessage): void {
    return this.notificatorService.dummy(data);
  }

  @EventPattern(MobileEventType.CLAIM)
  public claim(@Payload() data: IMessage): void {
    return this.notificatorService.dummy(data);
  }

  @EventPattern(MobileEventType.PURCHASE)
  public purchase(@Payload() data: IMessage): void {
    return this.notificatorService.dummy(data);
  }

  @EventPattern(MobileEventType.PURCHASE_RANDOM)
  public purchaseRandom(@Payload() data: IMessage): void {
    return this.notificatorService.dummy(data);
  }

  @EventPattern(MobileEventType.LEVEL_UP)
  public upgrade(@Payload() data: IMessage): void {
    return this.notificatorService.dummy(data);
  }
}
