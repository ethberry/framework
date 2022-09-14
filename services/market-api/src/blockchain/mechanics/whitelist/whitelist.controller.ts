import { Body, Controller, Post } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { WhitelistService } from "./whitelist.service";
import { WhitelistEntity } from "./whitelist.entity";
import { WhitelistItemCreateDto } from "./dto";

@ApiBearerAuth()
@Controller("/whitelist")
export class WhitelistController {
  constructor(private readonly whitelistService: WhitelistService) {}

  @Post("/")
  public create(@Body() dto: WhitelistItemCreateDto): Promise<WhitelistEntity> {
    return this.whitelistService.create(dto);
  }
}
