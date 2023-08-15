import { Body, Controller, Post } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import type { IServerSignature } from "@gemunion/types-blockchain";
import { User } from "@gemunion/nest-js-utils";

import { MarketplaceService } from "./marketplace.service";
import { SignTemplateDto } from "./dto";
import { MerchantEntity } from "../../../infrastructure/merchant/merchant.entity";

@ApiBearerAuth()
@Controller("/marketplace")
export class MarketplaceController {
  constructor(private readonly marketplaceService: MarketplaceService) {}

  @Post("/sign")
  public sign(@Body() dto: SignTemplateDto, @User() merchantEntity: MerchantEntity): Promise<IServerSignature> {
    return this.marketplaceService.sign(dto, merchantEntity);
  }
}
