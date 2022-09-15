import { Body, Controller, Post } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { WaitlistService } from "./waitlist.service";
import { WaitlistEntity } from "./waitlist.entity";
import { WhitelistItemCreateDto } from "./dto";

@ApiBearerAuth()
@Controller("/whitelist")
export class WaitlistController {
  constructor(private readonly whitelistService: WaitlistService) {}

  @Post("/")
  public create(@Body() dto: WhitelistItemCreateDto): Promise<WaitlistEntity> {
    return this.whitelistService.create(dto);
  }
}
