import { Body, Controller, Post } from "@nestjs/common";

import { Public } from "@gemunion/nest-js-utils";
import { IServerSignature } from "@gemunion/types-collection";

import { MarketplaceService } from "./marketplace.service";
import { SignLootboxDto, SignTemplateDto } from "./dto";

@Public()
@Controller("/marketplace")
export class MarketplaceController {
  constructor(private readonly marketplaceService: MarketplaceService) {}

  @Post("/template")
  public signTemplate(@Body() dto: SignTemplateDto): Promise<IServerSignature> {
    return this.marketplaceService.signTemplate(dto);
  }

  @Post("/lootbox")
  public signLootbox(@Body() dto: SignLootboxDto): Promise<IServerSignature> {
    return this.marketplaceService.signLootbox(dto);
  }
}
