import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { EventHistoryModule } from "../../event-history/event-history.module";
import { TokenEntity } from "./token.entity";
import { TokenService } from "./token.service";
import { TokenServiceEth } from "./token.service.eth";
import { signalServiceProvider } from "../../../common/providers";

@Module({
  imports: [ConfigModule, EventHistoryModule, TypeOrmModule.forFeature([TokenEntity])],
  providers: [signalServiceProvider, Logger, TokenService, TokenServiceEth],
  exports: [TokenService, TokenServiceEth],
})
export class TokenModule {}
