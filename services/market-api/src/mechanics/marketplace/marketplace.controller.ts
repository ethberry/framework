import { Body, Controller, Post } from "@nestjs/common";

import { Public } from "@gemunion/nest-js-utils";
import { IServerSignature } from "@gemunion/types-collection";

import { MarketplaceService } from "./marketplace.service";
import { SignTemplateDto } from "./dto";

@Public()
@Controller("/marketplace")
export class Erc721MarketplaceController {
  constructor(private readonly erc721MarketplaceService: MarketplaceService) {}

  @Post("/sign-template")
  public signTemplate(@Body() dto: SignTemplateDto): Promise<IServerSignature> {
    return this.erc721MarketplaceService.signTemplate(dto);
  }

  @Post("/sign-dropbox")
  public signDropbox(@Body() dto: SignTemplateDto): Promise<IServerSignature> {
    return this.erc721MarketplaceService.signDropbox(dto);
  }
}
