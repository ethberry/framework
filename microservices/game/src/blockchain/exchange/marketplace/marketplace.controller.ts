import { Body, Controller, Post } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import type { IServerSignature } from "@gemunion/types-blockchain";

import { MarketplaceService } from "./marketplace.service";
import { SignTemplateDto } from "./dto";

@ApiBearerAuth()
@Controller("/marketplace")
export class MarketplaceController {
  constructor(private readonly marketplaceService: MarketplaceService) {}

  @Post("/sign")
  public sign(@Body() dto: SignTemplateDto): Promise<IServerSignature> {
    return this.marketplaceService.sign(dto);
  }
}
