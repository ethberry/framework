import { EventPattern, Payload } from "@nestjs/microservices";
import { Controller } from "@nestjs/common";

import { IMessage, GameType } from "@framework/types";

import { NotificatorService } from "./notificator.service";

@Controller()
export class NotificatorController {
  constructor(private notificatorService: NotificatorService) {}

  @EventPattern(GameType.DUMMY)
  dummy(@Payload() data: IMessage): void {
    return this.notificatorService.dummy(data);
  }
}
