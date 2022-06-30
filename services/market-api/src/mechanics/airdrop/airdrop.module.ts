import { Module } from "@nestjs/common";

import { TypeOrmModule } from "@nestjs/typeorm";

import { AirdropService } from "./airdrop.service";
import { AirdropEntity } from "./airdrop.entity";
import { AirdropController } from "./airdrop.controller";

@Module({
  imports: [TypeOrmModule.forFeature([AirdropEntity])],
  providers: [AirdropService],
  controllers: [AirdropController],
  exports: [AirdropService],
})
export class AirdropModule {}
