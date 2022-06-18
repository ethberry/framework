import { Controller, Get } from "@nestjs/common";

import { NotificatorService } from "./notificator.service";

@Controller("/notificator")
export class NotificatorController {
  constructor(private notificatorService: NotificatorService) {}

  @Get("/dummy")
  public dummy(): void {
    this.notificatorService.dummy();
  }
}
