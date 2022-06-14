import { Body, Controller, Post } from "@nestjs/common";

import { Public } from "@gemunion/nest-js-utils";
import { IServerSignature } from "@gemunion/types-collection";

import { Erc998MarketplaceService } from "./marketplace.service";
import { SignTemplateDto } from "./dto";

@Public()
@Controller("/erc998-marketplace")
export class Erc998MarketplaceController {
  constructor(private readonly erc998MarketplaceService: Erc998MarketplaceService) {}

  @Post("/sign-template")
  public signTemplate(@Body() dto: SignTemplateDto): Promise<IServerSignature> {
    return this.erc998MarketplaceService.signTemplate(dto);
  }

  @Post("/sign-dropbox")
  public signDropbox(@Body() dto: SignTemplateDto): Promise<IServerSignature> {
    return this.erc998MarketplaceService.signDropbox(dto);
  }
}
