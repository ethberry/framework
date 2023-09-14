import { forwardRef, Logger, Module } from "@nestjs/common";
import admin from "firebase-admin";

import { PassportInitialize } from "@gemunion/nest-js-module-passport";

import { UserModule } from "../user/user.module";
import { FirebaseStrategy } from "./strategies";
import { AuthService } from "./auth.service";
import { APP_PROVIDER } from "./auth.constants";

@Module({
  imports: [PassportInitialize.forRoot(), forwardRef(() => UserModule)],
  providers: [
    Logger,
    AuthService,
    FirebaseStrategy,
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
