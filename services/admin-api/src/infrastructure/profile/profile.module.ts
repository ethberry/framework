import { Module } from "@nestjs/common";
import admin from "firebase-admin";

import { MetamaskModule } from "@gemunion/nest-js-module-metamask";

import { AddressModule } from "../../ecommerce/address/address.module";
import { AuthModule } from "../auth/auth.module";
import { UserModule } from "../user/user.module";
import { ProfileAddressController } from "./profile.address.controller";
import { ProfileGeneralController } from "./profile.general.controller";
import { ProfileService } from "./profile.service";
import { ProfileWalletController } from "./profile.wallet.controller";
import { APP_PROVIDER } from "../auth/auth.constants";

@Module({
  imports: [AddressModule, AuthModule, UserModule, MetamaskModule],
  providers: [
    ProfileService,
    {
      provide: APP_PROVIDER,
      useValue: admin,
    },
  ],
  controllers: [ProfileAddressController, ProfileGeneralController, ProfileWalletController],
  exports: [ProfileService],
})
export class ProfileModule {}
