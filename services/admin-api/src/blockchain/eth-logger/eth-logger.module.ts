import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { EthLoggerService } from "./eth-logger.service";
import { EthLoggerController } from "./eth-logger.controller";
import {
  ethLoggerInServiceProvider,
  ethLoggerOutServiceProvider,
  ethTxInServiceProvider,
} from "../../common/providers";

@Module({
  imports: [ConfigModule],
  providers: [ethLoggerInServiceProvider, ethLoggerOutServiceProvider, ethTxInServiceProvider, EthLoggerService],
  controllers: [EthLoggerController],
  exports: [EthLoggerService],
})
export class EthLoggerModule {}
