import { Injectable, NotFoundException } from "@nestjs/common";
import { ClientProxyFactory, Transport } from "@nestjs/microservices";
import { ConfigService } from "@nestjs/config";

import { CoreEthType, GemunionSupportedChains } from "@framework/types";

import type { IEthLoggerInOutDto } from "./interfaces";

@Injectable()
export class EthLoggerService {
  constructor(private readonly configService: ConfigService) {}

  private getClientProxyForChain(chainId: number) {
    const networkName = Object.keys(GemunionSupportedChains)[Object.values(GemunionSupportedChains).indexOf(chainId)];
    if (!networkName) {
      throw new NotFoundException("networkNotFound");
    }

    const rmqUrl = this.configService.get<string>("RMQ_URL", "amqp://127.0.0.1:5672");
    const rmqQueueEthName = this.configService.get<string>(
      `RMQ_QUEUE_CORE_ETH_${networkName}`,
      `CORE_ETH_${networkName}`.toLowerCase(),
    );

    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [rmqUrl],
        queue: rmqQueueEthName,
        queueOptions: {
          durabl: false,
        },
      },
    });
  }

  public async addListener(dto: IEthLoggerInOutDto): Promise<any> {
    const clientProxy = this.getClientProxyForChain(dto.chainId);
    return clientProxy.emit(CoreEthType.ADD_LISTENER, dto).toPromise();
  }

  public async removeListener(dto: IEthLoggerInOutDto): Promise<any> {
    const clientProxy = this.getClientProxyForChain(dto.chainId);
    return clientProxy.emit(CoreEthType.REMOVE_LISTENER, dto).toPromise();
  }
}
