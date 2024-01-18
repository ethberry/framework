import { Body, Controller, Delete, Post } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { User } from "@gemunion/nest-js-utils";
import { MetamaskDto } from "@gemunion/nest-js-module-metamask";

import { UserEntity } from "../user/user.entity";
import { ProfileService } from "./profile.service";

@ApiBearerAuth()
@Controller("/profile/wallet")
export class ProfileWalletController {
  constructor(private readonly profileService: ProfileService) {}

  @Post("/")
  public attachWallet(@User() userEntity: UserEntity, @Body() dto: MetamaskDto): Promise<UserEntity> {
    return this.profileService.attach(userEntity, dto);
  }

  @Delete("/")
  public detachWallet(@User() userEntity: UserEntity): Promise<UserEntity> {
    return this.profileService.detach(userEntity);
  }
}
