import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";

import { ethersRpcProvider, ethersSignerProvider } from "@gemunion/nestjs-ethers";
import { SignerModule } from "@gemunion/nest-js-module-exchange-signer";

import { ClaimService } from "./claim.service";
import { TemplateModule } from "../../blockchain/hierarchy/template/template.module";
import { ClaimEntity } from "./claim.entity";
import { AssetModule } from "../asset/asset.module";

@Module({
  imports: [ConfigModule, SignerModule, TemplateModule, AssetModule, TypeOrmModule.forFeature([ClaimEntity])],
  providers: [ethersRpcProvider, ethersSignerProvider, Logger, ClaimService],
  exports: [ClaimService],
})
export class ClaimModule {}
