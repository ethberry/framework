import { Module } from "@nestjs/common";

import { TypeOrmModule } from "@nestjs/typeorm";

import { Erc998AirdropService } from "./airdrop.service";
import { AirdropEntity } from "./airdrop.entity";
import { Erc998AirdropController } from "./airdrop.controller";

@Module({
  imports: [TypeOrmModule.forFeature([AirdropEntity])],
  providers: [Erc998AirdropService],
  controllers: [Erc998AirdropController],
  exports: [Erc998AirdropService],
})
export class Erc998AirdropModule {}
