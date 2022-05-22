import { Inject, Injectable, Logger, LoggerService } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { AbiItem } from "web3-utils";

import { Web3LogService } from "@gemunion/nestjs-web3";

import { Erc20TokenStatus } from "@framework/types";

import { Erc20TokenService } from "../token/token.service";
import { Erc20VestingService } from "../vesting/vesting.service";
import { ICreateListenerPayload } from "./interfaces";

import ERC20BlackList from "@framework/binance-contracts/artifacts/contracts/ERC20/ERC20BlackList.sol/ERC20BlackList.json";
import ERC20Simple from "@framework/binance-contracts/artifacts/contracts/ERC20/ERC20Simple.sol/ERC20Simple.json";

import CliffVesting from "@framework/binance-contracts/artifacts/contracts/Vesting/CliffVesting.sol/CliffVesting.json";
import GradedVesting from "@framework/binance-contracts/artifacts/contracts/Vesting/GradedVesting.sol/GradedVesting.json";
import LinearVesting from "@framework/binance-contracts/artifacts/contracts/Vesting/LinearVesting.sol/LinearVesting.json";

@Injectable()
export class Erc20LogService {
  private chainId: number;
  private abiArr: Array<AbiItem>;

  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly configService: ConfigService,
    private readonly erc20TokenService: Erc20TokenService,
    private readonly erc20VestingService: Erc20VestingService,
    private readonly web3LogService: Web3LogService,
  ) {
    this.chainId = this.configService.get<number>("CHAIN_ID", 1337);
    // todo pre-compute it
    this.abiArr = Object.values(
      ERC20BlackList.abi
        .concat(ERC20Simple.abi)
        .concat(CliffVesting.abi)
        .concat(GradedVesting.abi)
        .concat(LinearVesting.abi)
        .filter(el => {
          return el.type === "event";
        })
        .reduce((memo, current) => {
          if (current.name && !(current.name in memo)) {
            memo[current.name] = current as AbiItem;
          }
          return memo;
        }, {} as Record<string, AbiItem>),
    );
  }

  public async init(): Promise<void> {
    const erc20TokenEntities = await this.erc20TokenService.findAll({
      tokenStatus: Erc20TokenStatus.ACTIVE,
      chainId: this.chainId,
    });

    const erc20VestingEntities = await this.erc20VestingService.findAll({
      chainId: this.chainId,
    });

    const listenTokenAddrss = erc20TokenEntities.map(erc20TokenEntity => erc20TokenEntity.address);
    const listenVestingAddrss = erc20VestingEntities.map(erc20VestingEntity => erc20VestingEntity.address);
    this.loggerService.log(
      `Listening@Erc20: ${listenTokenAddrss.concat(listenVestingAddrss).toString()}`,
      Erc20LogService.name,
    );

    await this.web3LogService.listen({
      logOptions: {
        address: listenTokenAddrss.concat(listenVestingAddrss),
        topics: [],
      },
      contractInterface: this.abiArr,
    });
  }

  public async update(dto: ICreateListenerPayload): Promise<void> {
    await this.web3LogService.unsubscribe();

    await this.web3LogService.listen({
      logOptions: dto,
      contractInterface: this.abiArr,
    });
  }

  public async add(dto: ICreateListenerPayload): Promise<void> {
    const erc20TokenEntities = await this.erc20TokenService.findAll({
      tokenStatus: Erc20TokenStatus.ACTIVE,
      chainId: this.chainId,
    });
    const erc20VestingEntities = await this.erc20VestingService.findAll({
      chainId: this.chainId,
    });
    const listenTokenAddrss = erc20TokenEntities.map(erc20TokenEntity => erc20TokenEntity.address);
    const listenVestingAddrss = erc20VestingEntities.map(erc20VestingEntity => erc20VestingEntity.address);

    const listenAddrss = dto.address
      ? listenTokenAddrss.concat(listenVestingAddrss).concat(dto.address)
      : listenTokenAddrss.concat(listenVestingAddrss);
    this.loggerService.log(`Listening@Erc20: ${listenAddrss.toString()}`, Erc20LogService.name);
    await this.web3LogService.unsubscribe();

    await this.web3LogService.listen({
      logOptions: {
        address: listenAddrss,
        topics: dto.topics,
      },
      contractInterface: this.abiArr,
    });
  }
}
