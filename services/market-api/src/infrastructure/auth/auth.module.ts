import { Logger, Module } from "@nestjs/common";
import admin from "firebase-admin";

import { MetamaskModule } from "@gemunion/nest-js-module-metamask";
import { ParticleModule } from "@gemunion/nest-js-module-particle";
import { PassportInitialize } from "@gemunion/nest-js-module-passport";

import { UserModule } from "../user/user.module";
import { APP_PROVIDER } from "./auth.constants";
import { AuthMetamaskController } from "./auth.metamask.controller";
import { AuthMetamaskService } from "./auth.metamask.service";
import { AuthParticleController } from "./auth.particle.controller";
import { AuthParticleService } from "./auth.particle.service";
import { AuthService } from "./auth.service";
import { FirebaseStrategy } from "./strategies";

@Module({
  imports: [MetamaskModule, ParticleModule, UserModule, PassportInitialize.forRoot()],
  providers: [
    Logger,
    AuthService,
    AuthMetamaskService,
    AuthParticleService,
    FirebaseStrategy,
    {
      provide: APP_PROVIDER,
      useValue: admin,
    },
  ],
  controllers: [AuthMetamaskController, AuthParticleController],
  exports: [AuthService],
})
export class AuthModule {
  public configure(): void {
    admin.initializeApp();
  }
}
