import { ConfigService } from "@nestjs/config";
import { ethers } from "ethers";

import { EthProviderType } from "@framework/types";

export const ethersSignerProvider = {
  provide: EthProviderType.ETHERS_SIGNER,
  inject: [ConfigService],
  useFactory: (configService: ConfigService): ethers.Wallet => {
    const rpcUrl = configService.get<string>("JSON_RPC_ADDR", "");
    const privateKey = configService.get<string>("PRIVATE_KEY", "");

    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);

    const wallet = new ethers.Wallet(privateKey);
    wallet.connect(provider);

    return wallet.connect(provider);
  },
};
