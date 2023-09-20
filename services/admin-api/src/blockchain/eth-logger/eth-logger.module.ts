import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import {
  coreEthServiceProviderBesu,
  coreEthServiceProviderBinance,
  ethTxInServiceProvider,
} from "../../common/providers";
import { EthLoggerService } from "./eth-logger.service";
import { EthLoggerController } from "./eth-logger.controller";

@Module({
  imports: [ConfigModule],
  providers: [
    coreEthServiceProviderBesu,
    coreEthServiceProviderBinance,
    ethTxInServiceProvider,
    Logger,
    EthLoggerService,
  ],
  controllers: [EthLoggerController],
  exports: [EthLoggerService],
})
export class EthLoggerModule {}
