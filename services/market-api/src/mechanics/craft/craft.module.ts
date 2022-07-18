import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { CraftService } from "./craft.service";
import { CraftController } from "./craft.controller";
import { CraftEntity } from "./craft.entity";
import { AssetModule } from "../asset/asset.module";
import { SignerModule } from "../signer/signer.module";

@Module({
  imports: [SignerModule, AssetModule, TypeOrmModule.forFeature([CraftEntity])],
  providers: [Logger, CraftService],
  controllers: [CraftController],
  exports: [CraftService],
})
export class CraftModule {}
