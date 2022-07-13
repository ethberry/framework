import { Logger, Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";

import { ethersRpcProvider, ethersSignerProvider } from "@gemunion/nestjs-ethers";

import { AirdropEntity } from "./airdrop.entity";
import { AirdropService } from "./airdrop.service";
import { AirdropController } from "./airdrop.controller";
import { AssetModule } from "../asset/asset.module";
import { TemplateModule } from "../../blockchain/hierarchy/template/template.module";

@Module({
  imports: [ConfigModule, forwardRef(() => AssetModule), TemplateModule, TypeOrmModule.forFeature([AirdropEntity])],
  providers: [Logger, ethersSignerProvider, ethersRpcProvider, AirdropService],
  controllers: [AirdropController],
  exports: [AirdropService],
})
export class AirdropModule {}
