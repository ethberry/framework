import { Body, Controller, Post } from "@nestjs/common";

import { Public } from "@gemunion/nest-js-utils";
import { IServerSignature } from "@framework/types";

import { Erc721MarketplaceService } from "./marketplace.service";
import { SignTemplateDto } from "./dto";

@Public()
@Controller("/erc721-marketplace")
export class Erc721MarketplaceController {
  constructor(private readonly erc721MarketplaceService: Erc721MarketplaceService) {}

  @Post("/sign-template")
  public signTemplate(@Body() dto: SignTemplateDto): Promise<IServerSignature> {
    return this.erc721MarketplaceService.signTemplate(dto);
  }

  @Post("/sign-dropbox")
  public signDropbox(@Body() dto: SignTemplateDto): Promise<IServerSignature> {
    return this.erc721MarketplaceService.signDropbox(dto);
  }
}
