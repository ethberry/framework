import { Logger, Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";

import { ethersRpcProvider, ethersSignerProvider } from "@gemunion/nestjs-ethers";

import { AirdropEntity } from "./airdrop.entity";
import { AirdropService } from "./airdrop.service";
import { AirdropController } from "./airdrop.controller";
import { AssetModule } from "../../blockchain/asset/asset.module";
import { AirdropSignService } from "./airdrop.sign.service";

@Module({
  imports: [ConfigModule, forwardRef(() => AssetModule), TypeOrmModule.forFeature([AirdropEntity])],
  providers: [Logger, ethersSignerProvider, ethersRpcProvider, AirdropSignService, AirdropService],
  controllers: [AirdropController],
  exports: [AirdropService],
})
export class AirdropModule {}
