import { Controller, Get } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { WaitlistListService } from "./list.service";
import { WaitlistListEntity } from "./list.entity";

@ApiBearerAuth()
@Controller("/waitlist/list")
export class WaitlistListController {
  constructor(private readonly waitlistListService: WaitlistListService) {}

  @Get("/autocomplete")
  public autocomplete(): Promise<Array<WaitlistListEntity>> {
    return this.waitlistListService.autocomplete();
  }
}
