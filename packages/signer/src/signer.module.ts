import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { ethersRpcProvider, ethersSignerProvider } from "@gemunion/nestjs-ethers";

import { SignerService } from "./signer.service";

@Module({
  imports: [ConfigModule],
  providers: [ethersRpcProvider, ethersSignerProvider, Logger, SignerService],
  exports: [SignerService],
})
export class SignerModule {}
