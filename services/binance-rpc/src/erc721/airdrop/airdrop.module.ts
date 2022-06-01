import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";

import { Erc721TemplateModule } from "../template/template.module";
import { Erc721AirdropEntity } from "./airdrop.entity";
import { Erc721AirdropService } from "./airdrop.service";
import { Erc721AirdropLogModule } from "./airdrop-log/airdrop-log.module";

@Module({
  imports: [
    Erc721AirdropLogModule,
    Erc721TemplateModule,
    ConfigModule,
    TypeOrmModule.forFeature([Erc721AirdropEntity]),
  ],
  providers: [Erc721AirdropService],
  exports: [Erc721AirdropService],
})
export class Erc721AirdropModule {}
