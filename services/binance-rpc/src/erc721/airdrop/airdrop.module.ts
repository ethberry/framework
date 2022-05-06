import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";

import { Erc721TemplateModule } from "../template/template.module";
import { Erc721AirdropEntity } from "./airdrop.entity";
import { Erc721AirdropService } from "./airdrop.service";

@Module({
  imports: [TypeOrmModule.forFeature([Erc721AirdropEntity]), Erc721TemplateModule, ConfigModule],
  providers: [Erc721AirdropService],
  exports: [Erc721AirdropService],
})
export class Erc721AirdropModule {}
