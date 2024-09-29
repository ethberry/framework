import { Module } from "@nestjs/common";

import { ChainLinkModule } from "./chain-link/chain-link.module";
import { InfuraModule } from "./infura/infura.module";
import { NftStorageModule } from "./nft-storage/nft-storage.module";
import { PinataModule } from "./pinata/pinata.module";

@Module({
  imports: [ChainLinkModule, InfuraModule, NftStorageModule, PinataModule],
})
export class IntegrationsModule {}
