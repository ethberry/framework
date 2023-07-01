import { Logger, Module } from "@nestjs/common";
import admin from "firebase-admin";

import { PassportInitialize } from "@gemunion/nest-js-module-passport";

import { UserModule } from "../user/user.module";
import { FirebaseWsStrategy } from "./strategies";
import { APP_PROVIDER } from "./auth.constants";

@Module({
  imports: [UserModule, PassportInitialize.forRoot()],
  providers: [
    Logger,
    FirebaseWsStrategy,
    {
      provide: APP_PROVIDER,
      useValue: admin,
    },
  ],
})
export class AuthModule {
  public configure(): void {
    admin.initializeApp();
  }
}
