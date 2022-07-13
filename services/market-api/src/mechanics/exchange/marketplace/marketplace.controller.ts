import { Body, Controller, Post } from "@nestjs/common";

import { Public, User } from "@gemunion/nest-js-utils";
import { IServerSignature } from "@gemunion/types-collection";

import { MarketplaceService } from "./marketplace.service";
import { SignDropboxDto, SignTemplateDto } from "./dto";
import { UserEntity } from "../../../user/user.entity";

@Public()
@Controller("/exchange/purchase")
export class MarketplaceController {
  constructor(private readonly marketplaceService: MarketplaceService) {}

  @Post("/template")
  public signTemplate(@Body() dto: SignTemplateDto, @User() userEntity: UserEntity): Promise<IServerSignature> {
    return this.marketplaceService.signTemplate(dto, userEntity);
  }

  @Post("/dropbox")
  public signDropbox(@Body() dto: SignDropboxDto, @User() userEntity: UserEntity): Promise<IServerSignature> {
    return this.marketplaceService.signDropbox(dto, userEntity);
  }
}
