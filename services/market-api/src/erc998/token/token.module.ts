import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Erc998TokenService } from "./token.service";
import { Erc998TokenEntity } from "./token.entity";
import { Erc998TokenController } from "./token.controller";
import { Erc998TokenHistoryModule } from "./token-history/token-history.module";

@Module({
  imports: [Erc998TokenHistoryModule, TypeOrmModule.forFeature([Erc998TokenEntity])],
  providers: [Erc998TokenService],
  controllers: [Erc998TokenController],
  exports: [Erc998TokenService],
})
export class Erc998TokenModule {}
