import { Inject, Injectable, Logger, LoggerService } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { AbiItem } from "web3-utils";

import { Web3LogService } from "@gemunion/nestjs-web3";

import { Erc20TokenStatus } from "@framework/types";

import { Erc20VestingService } from "../vesting/vesting.service";
import { ERC20VestingFullEvents, ICreateListenerPayload } from "./interfaces";

@Injectable()
export class Erc20VestingLogService {
  private chainId: number;
  private abiArr: Array<AbiItem>;

  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly configService: ConfigService,
    private readonly erc20VestingService: Erc20VestingService,
    private readonly web3LogService: Web3LogService,
  ) {
    this.chainId = this.configService.get<number>("CHAIN_ID", 1337);
  }

  public async init(): Promise<void> {
    const erc20VestingEntities = await this.erc20VestingService.findAll({
      chainId: this.chainId,
    });

    const listenVestingAddrss = erc20VestingEntities.map(erc20VestingEntity => erc20VestingEntity.address);
    this.loggerService.log(`Listening@Erc20Vesting: ${listenVestingAddrss.toString()}`, Erc20VestingLogService.name);

    await this.web3LogService.listen({
      logOptions: {
        address: listenVestingAddrss,
        topics: [],
      },
      contractInterface: ERC20VestingFullEvents,
    });
  }

  public async update(dto: ICreateListenerPayload): Promise<void> {
    await this.web3LogService.unsubscribe();

    await this.web3LogService.listen({
      logOptions: dto,
      contractInterface: ERC20VestingFullEvents,
    });
  }

  public async add(dto: ICreateListenerPayload): Promise<void> {
    const erc20VestingEntities = await this.erc20VestingService.findAll({
      chainId: this.chainId,
    });
    const listenVestingAddrss = erc20VestingEntities.map(erc20VestingEntity => erc20VestingEntity.address);

    const listenAddrss = dto.address ? listenVestingAddrss.concat(dto.address) : listenVestingAddrss;
    this.loggerService.log(`Listening@Erc20Vesting: ${listenAddrss.toString()}`, Erc20VestingLogService.name);
    await this.web3LogService.unsubscribe();

    await this.web3LogService.listen({
      logOptions: {
        address: listenAddrss,
        topics: dto.topics,
      },
      contractInterface: ERC20VestingFullEvents,
    });
  }
}
