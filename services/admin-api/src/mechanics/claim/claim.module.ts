import { forwardRef, Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";

import { ethersRpcProvider, ethersSignerProvider } from "@gemunion/nestjs-ethers";

import { ClaimEntity } from "./claim.entity";
import { ClaimService } from "./claim.service";
import { ClaimController } from "./claim.controller";
import { AssetModule } from "../asset/asset.module";
import { TemplateModule } from "../../blockchain/hierarchy/template/template.module";

@Module({
  imports: [ConfigModule, forwardRef(() => AssetModule), TemplateModule, TypeOrmModule.forFeature([ClaimEntity])],
  providers: [Logger, ethersSignerProvider, ethersRpcProvider, ClaimService],
  controllers: [ClaimController],
  exports: [ClaimService],
})
export class ClaimModule {}
