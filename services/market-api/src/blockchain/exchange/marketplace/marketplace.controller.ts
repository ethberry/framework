import { Body, Controller, Post } from "@nestjs/common";

import { Public, User } from "@ethberry/nest-js-utils";
import type { IServerSignature } from "@ethberry/types-blockchain";

import { UserEntity } from "../../../infrastructure/user/user.entity";
import { MarketplaceService } from "./marketplace.service";
import { TemplateSignDto } from "./dto";

@Public()
@Controller("/marketplace")
export class MarketplaceController {
  constructor(private readonly marketplaceService: MarketplaceService) {}

  @Post("/sign")
  public sign(@Body() dto: TemplateSignDto, @User() userEntity: UserEntity): Promise<IServerSignature> {
    return this.marketplaceService.sign(dto, userEntity);
  }
}
