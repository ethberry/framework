import { Inject, Injectable, Logger, LoggerService } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Log } from "@ethersproject/abstract-provider";

import { ILogEvent } from "@gemunion/nestjs-ethers";

import { emptyStateString } from "@gemunion/draft-js-utils";

import { imageUrl } from "@framework/constants";

import {
  ContractManagerEventType,
  Erc20TokenTemplate,
  Erc20VestingTemplate,
  Erc721TokenTemplate,
  Erc1155TokenTemplate,
  IContractManagerERC1155TokenDeployed,
  IContractManagerERC20TokenDeployed,
  IContractManagerERC20VestingDeployed,
  IContractManagerERC721TokenDeployed,
  TContractManagerEventData,
} from "@framework/types";

import { ContractManagerHistoryService } from "../contract-manager-history/contract-manager-history.service";
import { Erc20TokenService } from "../erc20/token/token.service";
import { Erc20VestingService } from "../vesting/vesting/vesting.service";
import { Erc721CollectionService } from "../erc721/collection/collection.service";
import { Erc1155CollectionService } from "../erc1155/collection/collection.service";
// import { BlockchainService } from "../blockchain/blockchain.service";
import { Erc20LogService } from "../eth-log/erc20/erc20.log.service";
import { Erc721LogService } from "../eth-log/erc721/erc721.log.service";

@Injectable()
export class ContractManagerServiceEth {
  private chainId: number;

  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly configService: ConfigService,
    private readonly contractManagerHistoryService: ContractManagerHistoryService,
    private readonly erc20VestingService: Erc20VestingService,
    private readonly erc20TokenService: Erc20TokenService,
    private readonly erc721CollectionService: Erc721CollectionService,
    private readonly erc1155CollectionService: Erc1155CollectionService,
    private readonly erc20LogService: Erc20LogService,
    private readonly erc721LogService: Erc721LogService,
  ) {
    this.chainId = ~~configService.get<string>("CHAIN_ID", "1337");
  }

  public async erc20Vesting(event: ILogEvent<IContractManagerERC20VestingDeployed>, ctx: Log): Promise<void> {
    const {
      args: { addr, beneficiary, startTimestamp, duration, templateId },
    } = event;

    await this.updateHistory(event, ctx);

    await this.erc20VestingService.create({
      address: addr.toLowerCase(),
      beneficiary: beneficiary.toLowerCase(),
      startTimestamp: new Date(~~startTimestamp * 1000).toISOString(),
      duration: ~~duration * 1000, // msec
      contractTemplate: Object.values(Erc20VestingTemplate)[~~templateId],
      chainId: this.chainId,
    });
  }

  public async erc20Token(event: ILogEvent<IContractManagerERC20TokenDeployed>, ctx: Log): Promise<void> {
    const {
      args: { addr, name, symbol, cap, templateId },
    } = event;

    await this.updateHistory(event, ctx);

    await this.erc20TokenService.create({
      address: addr.toLowerCase(),
      title: name,
      name,
      symbol,
      amount: cap,
      description: emptyStateString,
      contractTemplate: Object.values(Erc20TokenTemplate)[~~templateId],
      chainId: this.chainId,
    });

    // log found in block:
    const fromBlock = ~~ctx.blockNumber.toString();
    // add new erc20 listener
    await this.erc20LogService.addListener({ address: addr.toLowerCase(), fromBlock });
  }

  public async erc721Token(event: ILogEvent<IContractManagerERC721TokenDeployed>, ctx: Log): Promise<void> {
    const {
      args: { addr, name, symbol, royalty, baseTokenURI, templateId },
    } = event;

    await this.updateHistory(event, ctx);

    await this.erc721CollectionService.create({
      address: addr.toLowerCase(),
      title: name,
      name,
      symbol,
      royalty: ~~royalty,
      description: emptyStateString,
      imageUrl,
      chainId: this.chainId,
      baseTokenURI,
      contractTemplate: Object.values(Erc721TokenTemplate)[~~templateId],
    });

    // log found in block:
    const fromBlock = ~~ctx.blockNumber.toString();

    // add new erc20 listener
    await this.erc721LogService.addListener({ address: addr.toLowerCase(), fromBlock });
  }

  public async erc1155Token(event: ILogEvent<IContractManagerERC1155TokenDeployed>, ctx: Log): Promise<void> {
    const {
      args: { addr, baseTokenURI, templateId },
    } = event;

    await this.updateHistory(event, ctx);

    await this.erc1155CollectionService.create({
      address: addr.toLowerCase(),
      title: "new 1155 collection",
      description: emptyStateString,
      imageUrl,
      chainId: this.chainId,
      baseTokenURI,
      contractTemplate: Object.values(Erc1155TokenTemplate)[~~templateId],
    });

    // await this.erc1155LogService.add({
    //   address: [addr.toLowerCase()],
    //   topics: [],
    // });
  }

  private async updateHistory(event: ILogEvent<TContractManagerEventData>, ctx: Log) {
    this.loggerService.log(
      JSON.stringify(
        Object.assign(
          { name: event.name, signature: event.signature, topic: event.topic, args: event.args },
          {
            address: ctx.address,
            transactionHash: ctx.transactionHash,
            blockNumber: ctx.blockNumber,
          },
        ),
        null,
        "\t",
      ),
      ContractManagerServiceEth.name,
    );

    const { args, name } = event;
    const { address, transactionHash } = ctx;

    await this.contractManagerHistoryService.create({
      address,
      transactionHash,
      eventType: name as ContractManagerEventType,
      eventData: args,
    });
  }
}
