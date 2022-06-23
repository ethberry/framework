import { EventPattern, Payload } from "@nestjs/microservices";
import { Controller } from "@nestjs/common";

import { IMessage, GameType } from "@framework/types";

import { NotificatorService } from "./notificator.service";

@Controller()
export class NotificatorController {
  constructor(private notificatorService: NotificatorService) {}

  // TODO listen to real events
  @EventPattern(GameType.DUMMY)
  public dummy(@Payload() data: IMessage): void {
    return this.notificatorService.dummy(data);
  }
}
