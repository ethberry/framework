import { Module } from "@nestjs/common";

import { ChainLinkModule } from "./chain-link/chain-link.module";
import { InfuraModule } from "./infura/infura.module";
import { NftStorageModule } from "./nft-storage/nft-storage.module";
import { OneInchModule } from "./1inch/one-inch.module";
import { PinataModule } from "./pinata/pinata.module";
import { Web3StorageModule } from "./web3-storage/web3-storage.module";

@Module({
  imports: [ChainLinkModule, InfuraModule, NftStorageModule, OneInchModule, PinataModule, Web3StorageModule],
})
export class IntegrationsModule {}
