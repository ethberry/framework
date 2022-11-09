import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { EthLoggerService } from "./eth-logger.service";
import { EthLoggerController } from "./eth-logger.controller";
import { ethLoggerInServiceProvider, ethLoggerOutServiceProvider } from "../../common/providers";

@Module({
  imports: [ConfigModule],
  providers: [ethLoggerInServiceProvider, ethLoggerOutServiceProvider, EthLoggerService],
  controllers: [EthLoggerController],
  exports: [EthLoggerService],
})
export class EthLoggerModule {}
