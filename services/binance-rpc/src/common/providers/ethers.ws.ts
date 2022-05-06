import { ConfigService } from "@nestjs/config";
import { ethers } from "ethers";

import { EthProviderType } from "@framework/types";

export const ethersWsProvider = {
  provide: EthProviderType.ETHERS_WS,
  inject: [ConfigService],
  useFactory: (configService: ConfigService): ethers.providers.WebSocketProvider => {
    const wsUrl = configService.get<string>("WEBSOCKET_ADDR", "");
    const provider = new ethers.providers.WebSocketProvider(wsUrl);
    return provider;
  },
};
