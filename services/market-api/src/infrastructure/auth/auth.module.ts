import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import admin from "firebase-admin";

import { MetamaskModule } from "@gemunion/nest-js-module-metamask";
import { PassportInitialize } from "@gemunion/nest-js-module-passport";

import { UserModule } from "../user/user.module";
import { APP_PROVIDER } from "./auth.constants";
import { AuthMetamaskController } from "./auth.metamask.controller";
import { AuthMetamaskService } from "./auth.metamask.service";
import { AuthService } from "./auth.service";
import { FirebaseStrategy } from "./strategies";

@Module({
  imports: [ConfigModule, MetamaskModule, UserModule, PassportInitialize.forRoot()],
  providers: [
    Logger,
    AuthService,
    AuthMetamaskService,
    FirebaseStrategy,
    {
      provide: APP_PROVIDER,
      useValue: admin,
    },
  ],
  controllers: [AuthMetamaskController],
  exports: [AuthService],
})
export class AuthModule {
  public configure(): void {
    admin.initializeApp();
  }
}
