import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { ethTxInServiceProvider } from "../../common/providers";
import { EthLoggerService } from "./eth-logger.service";
import { EthLoggerController } from "./eth-logger.controller";

@Module({
  imports: [ConfigModule],
  providers: [ethTxInServiceProvider, Logger, EthLoggerService],
  controllers: [EthLoggerController],
  exports: [EthLoggerService],
})
export class EthLoggerModule {}
