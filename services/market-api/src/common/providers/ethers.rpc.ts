import { ConfigService } from "@nestjs/config";
import { ethers } from "ethers";

import { EthProviderType } from "@framework/types";

export const ethersRpcProvider = {
  provide: EthProviderType.ETHERS_RPC,
  inject: [ConfigService],
  useFactory: (configService: ConfigService): ethers.providers.JsonRpcProvider => {
    const rpcUrl = configService.get<string>("JSON_RPC_ADDR", "");
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    return provider;
  },
};
