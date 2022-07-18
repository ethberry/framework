import { Body, Controller, Post } from "@nestjs/common";

import { Public } from "@gemunion/nest-js-utils";
import { IServerSignature } from "@gemunion/types-collection";

import { MarketplaceService } from "./marketplace.service";
import { SignTemplateDto } from "./dto";

@Public()
@Controller("/marketplace")
export class MarketplaceController {
  constructor(private readonly marketplaceService: MarketplaceService) {}

  @Post("/sign")
  public sign(@Body() dto: SignTemplateDto): Promise<IServerSignature> {
    return this.marketplaceService.sign(dto);
  }
}
