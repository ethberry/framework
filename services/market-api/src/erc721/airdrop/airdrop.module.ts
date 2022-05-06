import { Module } from "@nestjs/common";

import { TypeOrmModule } from "@nestjs/typeorm";

import { Erc721AirdropService } from "./airdrop.service";
import { Erc721AirdropEntity } from "./airdrop.entity";
import { Erc721AirdropController } from "./airdrop.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Erc721AirdropEntity])],
  providers: [Erc721AirdropService],
  controllers: [Erc721AirdropController],
  exports: [Erc721AirdropService],
})
export class Erc721AirdropModule {}
