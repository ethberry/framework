import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import type { IWeb3StorageOptions } from "@gemunion/nest-js-module-web3-storage-firebase";
import { Web3StorageFirebaseModule } from "@gemunion/nest-js-module-web3-storage-firebase";

import { Web3StorageService } from "./web3-storage.service";
import { Web3StorageController } from "./web3-storage.controller";
import { TokenModule } from "../../hierarchy/token/token.module";

@Module({
  imports: [
    TokenModule,
    Web3StorageFirebaseModule.forRootAsync(Web3StorageFirebaseModule, {
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): IWeb3StorageOptions => {
        const web3StorageApiToken = configService.get<string>("WEB3_STORAGE_API_TOKEN", "");
        return {
          web3StorageApiToken,
        };
      },
    }),
  ],
  providers: [Web3StorageService],
  controllers: [Web3StorageController],
  exports: [Web3StorageService],
})
export class Web3StorageModule {}
