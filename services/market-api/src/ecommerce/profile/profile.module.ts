import { Module } from "@nestjs/common";

import { MetamaskModule } from "@gemunion/nest-js-module-metamask";

import { ProfileService } from "./profile.service";
import { ProfileController } from "./profile.controller";
import { UserModule } from "../user/user.module";

@Module({
  imports: [UserModule, MetamaskModule],
  providers: [ProfileService],
  controllers: [ProfileController],
  exports: [ProfileService],
})
export class ProfileModule {}
