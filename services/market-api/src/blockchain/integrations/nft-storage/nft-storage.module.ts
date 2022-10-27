import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import type { INftStorageOptions } from "@gemunion/nest-js-module-nft-storage-firebase";
import { NftStorageFirebaseModule } from "@gemunion/nest-js-module-nft-storage-firebase";

import { NftstorageService } from "./nft-storage.service";
import { NftStorageController } from "./nft-storage.controller";
import { TokenModule } from "../../hierarchy/token/token.module";

@Module({
  imports: [
    TokenModule,
    NftStorageFirebaseModule.forRootAsync(NftStorageFirebaseModule, {
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): INftStorageOptions => {
        const nftStorageApiToken = configService.get<string>("NFT_STORAGE_API_TOKEN", "");
        return {
          nftStorageApiToken,
        };
      },
    }),
  ],
  providers: [NftstorageService],
  controllers: [NftStorageController],
  exports: [NftstorageService],
})
export class NftStorageModule {}
