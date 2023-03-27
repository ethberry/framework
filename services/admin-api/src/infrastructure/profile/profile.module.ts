import { Module } from "@nestjs/common";

import { AddressModule } from "../../ecommerce/address/address.module";
import { AuthModule } from "../auth/auth.module";
import { UserModule } from "../user/user.module";
import { ProfileAddressController } from "./profile.address.controller";
import { ProfileGeneralController } from "./profile.general.controller";
import { ProfileService } from "./profile.service";

@Module({
  imports: [AddressModule, AuthModule, UserModule],
  providers: [ProfileService],
  controllers: [ProfileAddressController, ProfileGeneralController],
  exports: [ProfileService],
})
export class ProfileModule {}
