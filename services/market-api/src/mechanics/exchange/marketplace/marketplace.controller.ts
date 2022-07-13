import { Body, Controller, Post } from "@nestjs/common";

import { Public } from "@gemunion/nest-js-utils";
import { IServerSignature } from "@gemunion/types-collection";

import { MarketplaceService } from "./marketplace.service";
import { SignDropboxDto, SignTemplateDto } from "./dto";

@Public()
@Controller("/exchange/purchase")
export class MarketplaceController {
  constructor(private readonly marketplaceService: MarketplaceService) {}

  @Post("/template")
  public signTemplate(@Body() dto: SignTemplateDto): Promise<IServerSignature> {
    return this.marketplaceService.signTemplate(dto);
  }

  @Post("/dropbox")
  public signDropbox(@Body() dto: SignDropboxDto): Promise<IServerSignature> {
    return this.marketplaceService.signDropbox(dto);
  }
}
