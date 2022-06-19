import { Module } from "@nestjs/common";

import { TypeOrmModule } from "@nestjs/typeorm";

import { Erc998AirdropService } from "./airdrop.service";
import { Erc998AirdropEntity } from "./airdrop.entity";
import { Erc998AirdropController } from "./airdrop.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Erc998AirdropEntity])],
  providers: [Erc998AirdropService],
  controllers: [Erc998AirdropController],
  exports: [Erc998AirdropService],
})
export class Erc998AirdropModule {}
