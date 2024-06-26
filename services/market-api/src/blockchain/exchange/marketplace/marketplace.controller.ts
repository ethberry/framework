import { Body, Controller, Post } from "@nestjs/common";

import { Public, User } from "@gemunion/nest-js-utils";
import type { IServerSignature } from "@gemunion/types-blockchain";

import { MarketplaceService } from "./marketplace.service";
import { SellTokenDto, TemplateSignDto } from "./dto";
import { UserEntity } from "../../../infrastructure/user/user.entity";

@Public()
@Controller("/marketplace")
export class MarketplaceController {
  constructor(private readonly marketplaceService: MarketplaceService) {}

  @Post("/sign")
  public sign(@Body() dto: TemplateSignDto, @User() userEntity: UserEntity): Promise<IServerSignature> {
    return this.marketplaceService.sign(dto, userEntity);
  }

  @Post("/sell")
  public sell(@Body() dto: SellTokenDto, @User() userEntity: UserEntity): Promise<any> {
    return this.marketplaceService.sell(dto, userEntity);
  }
}
