import { Body, Controller, Post } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import type { IServerSignature } from "@gemunion/types-blockchain";
import { User } from "@gemunion/nest-js-utils";

import { MerchantEntity } from "../../../infrastructure/merchant/merchant.entity";
import { MarketplaceService } from "./marketplace.service";
import { TemplateSignDto } from "./dto";

@ApiBearerAuth()
@Controller("/marketplace")
export class MarketplaceController {
  constructor(private readonly marketplaceService: MarketplaceService) {}

  @Post("/sign")
  public sign(@Body() dto: TemplateSignDto, @User() merchantEntity: MerchantEntity): Promise<IServerSignature> {
    return this.marketplaceService.sign(dto, merchantEntity);
  }
}
