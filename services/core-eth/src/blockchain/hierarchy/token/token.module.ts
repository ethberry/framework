import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { TokenEntity } from "./token.entity";
import { TokenService } from "./token.service";
import { TokenServiceEth } from "./token.service.eth";
import { EventHistoryModule } from "../../event-history/event-history.module";

@Module({
  imports: [ConfigModule, EventHistoryModule, TypeOrmModule.forFeature([TokenEntity])],
  providers: [TokenService, TokenServiceEth],
  exports: [TokenService, TokenServiceEth],
})
export class TokenModule {}
