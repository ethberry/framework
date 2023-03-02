import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import admin from "firebase-admin";

import { PassportInitialize } from "@gemunion/nest-js-module-passport";

import { UserModule } from "../user/user.module";
import { FirebaseStrategy, FirebaseWsStrategy } from "./strategies";
import { AuthService } from "./auth.service";
import { APP_PROVIDER } from "./auth.constants";

@Module({
  imports: [UserModule, ConfigModule, PassportInitialize.forRoot()],
  providers: [
    Logger,
    AuthService,
    FirebaseStrategy,
    FirebaseWsStrategy,
    {
      provide: APP_PROVIDER,
      useValue: admin,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {
  public configure(): void {
    admin.initializeApp();
  }
}
