import { Module } from "@nestjs/common";

import { MetamaskModule } from "@gemunion/nest-js-module-metamask";

import { AddressModule } from "../../ecommerce/address/address.module";
import { UserModule } from "../user/user.module";
import { ProfileAddressController } from "./profile.address.controller";
import { ProfileGeneralController } from "./profile.general.controller";
import { ProfileService } from "./profile.service";
import { ProfileWalletController } from "./profile.wallet.controller";

@Module({
  imports: [AddressModule, UserModule, MetamaskModule],
  providers: [ProfileService],
  controllers: [ProfileAddressController, ProfileGeneralController, ProfileWalletController],
  exports: [ProfileService],
})
export class ProfileModule {}
