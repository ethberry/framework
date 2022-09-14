import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { WhitelistEntity } from "./whitelist.entity";
import { WhitelistService } from "./whitelist.service";
import { WhitelistController } from "./whitelist.controller";

@Module({
  imports: [TypeOrmModule.forFeature([WhitelistEntity])],
  providers: [WhitelistService],
  controllers: [WhitelistController],
  exports: [WhitelistService],
})
export class WhitelistModule {}
