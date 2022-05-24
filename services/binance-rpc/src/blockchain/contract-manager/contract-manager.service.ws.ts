import { Inject, Injectable, Logger, LoggerService } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Web3 from "web3";

import { IEvent, WEB3_WEB3 } from "@gemunion/nestjs-web3";
import { emptyStateString } from "@gemunion/draft-js-utils";

import { imageUrl } from "@framework/constants";

import {
  ContractManagerEventType,
  IContractManagerERC1155TokenDeployed,
  IContractManagerERC20TokenDeployed,
  IContractManagerERC20VestingDeployed,
  IContractManagerERC721TokenDeployed,
  TContractManagerEventData,
} from "@framework/types";

import { ContractManagerHistoryService } from "../contract-manager-history/contract-manager-history.service";
import { Erc20TokenService } from "../../erc20/token/token.service";
import { Erc20VestingService } from "../../erc20/vesting/vesting.service";
import { Erc721CollectionService } from "../../erc721/collection/collection.service";
import { Erc1155CollectionService } from "../../erc1155/collection/collection.service";
import { Erc721LogService } from "../../erc721/logs/log.service";
import { Erc20LogService } from "../../erc20/logs/log.service";
import { Erc1155LogService } from "../../erc1155/logs/log.service";

import ERC20BlackList from "@framework/binance-contracts/artifacts/contracts/ERC20/ERC20BlackList.sol/ERC20BlackList.json";
import ERC20Simple from "@framework/binance-contracts/artifacts/contracts/ERC20/ERC20Simple.sol/ERC20Simple.json";

@Injectable()
export class ContractManagerServiceWs {
  private chainId: number;

  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    @Inject(WEB3_WEB3)
    private readonly web3: Web3,
    private readonly configService: ConfigService,
    private readonly contractManagerHistoryService: ContractManagerHistoryService,
    private readonly erc1155LogService: Erc1155LogService,
    private readonly erc721LogService: Erc721LogService,
    private readonly erc20LogService: Erc20LogService,
    private readonly erc20VestingService: Erc20VestingService,
    private readonly erc20TokenService: Erc20TokenService,
    private readonly erc721CollectionService: Erc721CollectionService,
    private readonly erc1155CollectionService: Erc1155CollectionService,
  ) {
    this.chainId = configService.get<number>("CHAIN_ID", 1);
  }

  public async erc20Vesting(event: IEvent<IContractManagerERC20VestingDeployed>): Promise<void> {
    const {
      // todo add contractType from event
      returnValues: { addr, beneficiary, startTimestamp, duration },
    } = event;

    await this.updateHistory(event);

    await this.erc20VestingService.create({
      address: addr.toLowerCase(),
      beneficiary,
      startTimestamp: new Date(~~`${startTimestamp}000`).toISOString(),
      duration: ~~duration,
    });

    await this.erc20LogService.add({
      address: [addr.toLowerCase()],
      topics: [],
    });
  }

  public async erc20Token(event: IEvent<IContractManagerERC20TokenDeployed>): Promise<void> {
    const {
      returnValues: { addr, name, symbol, cap },
    } = event;

    const byteCodeTempl = await this.web3.eth.getCode(addr);
    console.log("byteCodeTempl", byteCodeTempl);
    console.log("returnValues", event.returnValues);
    const erc20Template =
      byteCodeTempl === ERC20Simple.deployedBytecode
        ? "ERC20SMPL"
        : byteCodeTempl === ERC20BlackList.deployedBytecode
        ? "ERC20BL"
        : "";

    console.log("erc20Template", erc20Template);

    await this.updateHistory(event);

    await this.erc20TokenService.create({
      address: addr.toLowerCase(),
      title: name,
      symbol,
      amount: cap,
      description: emptyStateString,
      chainId: this.chainId,
    });

    await this.erc20LogService.add({
      address: [addr.toLowerCase()],
      topics: [],
    });
  }

  public async erc721Token(event: IEvent<IContractManagerERC721TokenDeployed>): Promise<void> {
    const {
      returnValues: { addr, name, symbol, royalty, baseTokenURI },
    } = event;

    await this.updateHistory(event);

    await this.erc721CollectionService.create({
      address: addr.toLowerCase(),
      title: name,
      symbol,
      royalty: ~~royalty,
      description: emptyStateString,
      imageUrl,
      chainId: this.chainId,
      baseTokenURI,
    });

    await this.erc721LogService.add({
      address: [addr.toLowerCase()],
      topics: [],
    });
  }

  public async erc1155Token(event: IEvent<IContractManagerERC1155TokenDeployed>): Promise<void> {
    const {
      returnValues: { addr, baseTokenURI },
    } = event;

    await this.updateHistory(event);

    await this.erc1155CollectionService.create({
      address: addr.toLowerCase(),
      title: "new 1155 collection",
      description: emptyStateString,
      imageUrl,
      chainId: this.chainId,
      baseTokenURI,
    });

    await this.erc1155LogService.add({
      address: [addr.toLowerCase()],
      topics: [],
    });
  }

  private async updateHistory(event: IEvent<TContractManagerEventData>) {
    this.loggerService.log(JSON.stringify(event, null, "\t"), ContractManagerServiceWs.name);

    const { returnValues, event: eventType, transactionHash, address } = event;

    await this.contractManagerHistoryService.create({
      address,
      transactionHash,
      eventType: eventType as ContractManagerEventType,
      eventData: returnValues,
    });
  }
}
