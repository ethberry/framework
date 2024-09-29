import { Logger, Module } from "@nestjs/common";
import admin from "firebase-admin";

import { PassportInitialize } from "@ethberry/nest-js-module-passport";

import { UserModule } from "../user/user.module";
import { FirebaseStrategy, FirebaseWsStrategy } from "./strategies";
import { AuthService } from "./auth.service";
import { APP_PROVIDER } from "./auth.constants";

@Module({
  imports: [UserModule, PassportInitialize.forRoot()],
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
