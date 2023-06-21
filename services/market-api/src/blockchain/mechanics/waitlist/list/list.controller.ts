import { Controller, Get } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { WaitListListService } from "./list.service";
import { WaitListListEntity } from "./list.entity";

@ApiBearerAuth()
@Controller("/waitlist/list")
export class WaitListListController {
  constructor(private readonly waitListListService: WaitListListService) {}

  @Get("/autocomplete")
  public autocomplete(): Promise<Array<WaitListListEntity>> {
    return this.waitListListService.autocomplete();
  }
}
