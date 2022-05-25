import { Inject, Injectable, Logger, LoggerService } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { Web3LogService } from "@gemunion/nestjs-web3";

import { Erc20TokenStatus } from "@framework/types";

import { Erc20TokenService } from "../token/token.service";
import { ERC20FullEvents, ICreateListenerPayload } from "./interfaces";

@Injectable()
export class Erc20LogService {
  private chainId: number;

  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly configService: ConfigService,
    private readonly erc20TokenService: Erc20TokenService,
    private readonly web3LogService: Web3LogService,
  ) {
    this.chainId = this.configService.get<number>("CHAIN_ID", 1337);
  }

  public async init(): Promise<void> {
    const erc20TokenEntities = await this.erc20TokenService.findAll({
      tokenStatus: Erc20TokenStatus.ACTIVE,
      chainId: this.chainId,
    });

    const listenAddrss = erc20TokenEntities.map(erc20TokenEntity => erc20TokenEntity.address);

    if (listenAddrss.length > 0) {
      await this.web3LogService.listen({
        logOptions: {
          address: listenAddrss,
          topics: [],
        },
        contractInterface: ERC20FullEvents,
      });
      this.loggerService.log(`Listening@Erc20: ${listenAddrss.toString()}`, Erc20LogService.name);
    }
  }

  public async update(dto: ICreateListenerPayload): Promise<void> {
    await this.web3LogService.unsubscribe();

    if (dto.address.length > 0) {
      await this.web3LogService.listen({
        logOptions: dto,
        contractInterface: ERC20FullEvents,
      });
      this.loggerService.log(`Listening@Erc20: ${dto.address.toString()}`, Erc20LogService.name);
    }
  }

  public async add(dto: ICreateListenerPayload): Promise<void> {
    const erc20TokenEntities = await this.erc20TokenService.findAll({
      tokenStatus: Erc20TokenStatus.ACTIVE,
      chainId: this.chainId,
    });

    const listenTokenAddrss = erc20TokenEntities.map(erc20TokenEntity => erc20TokenEntity.address);

    const listenAddrss = dto.address ? listenTokenAddrss.concat(dto.address) : listenTokenAddrss;
    this.loggerService.log(`Listening@Erc20: ${listenAddrss.toString()}`, Erc20LogService.name);
    await this.web3LogService.unsubscribe();

    await this.web3LogService.listen({
      logOptions: {
        address: listenAddrss,
        topics: dto.topics,
      },
      contractInterface: ERC20FullEvents,
    });
  }
}
