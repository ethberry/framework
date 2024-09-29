import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { ethersRpcProvider, ethersSignerProvider } from "@ethberry/nest-js-module-ethers-gcp";
import { SecretManagerModule } from "@ethberry/nest-js-module-secret-manager-gcp";

import { SignerService } from "./signer.service";

@Module({
  imports: [ConfigModule, SecretManagerModule.deferred()],
  providers: [ethersRpcProvider, ethersSignerProvider, Logger, SignerService],
  exports: [SignerService],
})
export class SignerModule {}
