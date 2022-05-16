import { Body, Controller, Post } from "@nestjs/common";

import { Public } from "@gemunion/nest-js-utils";
import { IServerSignature } from "@framework/types";

import { Erc1155MarketplaceService } from "./marketplace.service";
import { SignTokenDto } from "./dto";

@Public()
@Controller("/erc1155-marketplace")
export class Erc1155MarketplaceController {
  constructor(private readonly erc1155MarketplaceService: Erc1155MarketplaceService) {}

  @Post("/sign-token")
  public signToken(@Body() dto: SignTokenDto): Promise<IServerSignature> {
    return this.erc1155MarketplaceService.signToken(dto);
  }
}
