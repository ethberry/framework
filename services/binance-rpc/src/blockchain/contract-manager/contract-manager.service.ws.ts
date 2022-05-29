import { Inject, Injectable, Logger, LoggerService } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { IEvent } from "@gemunion/nestjs-web3";
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
import { Erc20TokenService } from "../../erc20/token/token.service";
import { Erc20VestingService } from "../../vesting/vesting/vesting.service";
import { Erc721CollectionService } from "../../erc721/collection/collection.service";
import { Erc1155CollectionService } from "../../erc1155/collection/collection.service";
import { Erc721LogService } from "../../erc721/logs/log.service";
import { Erc20LogService } from "../../erc20/logs/log.service";
import { Erc1155LogService } from "../../erc1155/logs/log.service";

@Injectable()
export class ContractManagerServiceWs {
  private chainId: number;

  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
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
    this.chainId = ~~configService.get<string>("CHAIN_ID", "1337");
  }

  public async erc20Vesting(event: IEvent<IContractManagerERC20VestingDeployed>): Promise<void> {
    const {
      returnValues: { addr, beneficiary, startTimestamp, duration, templateId },
    } = event;

    await this.updateHistory(event);

    await this.erc20VestingService.create({
      address: addr.toLowerCase(),
      beneficiary: beneficiary.toLowerCase(),
      startTimestamp: new Date(~~startTimestamp * 1000).toISOString(),
      duration: ~~duration * 1000, // msec
      contractTemplate: Object.values(Erc20VestingTemplate)[~~templateId],
      chainId: this.chainId,
    });

    await this.erc20LogService.add({
      address: [addr.toLowerCase()],
      topics: [],
    });
  }

  public async erc20Token(event: IEvent<IContractManagerERC20TokenDeployed>): Promise<void> {
    const {
      returnValues: { addr, name, symbol, cap, templateId },
    } = event;

    await this.updateHistory(event);

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

    // TODO should we listen for NEW collections?
    await this.erc20LogService.add({
      address: [addr.toLowerCase()],
      topics: [],
    });
  }

  public async erc721Token(event: IEvent<IContractManagerERC721TokenDeployed>): Promise<void> {
    const {
      returnValues: { addr, name, symbol, royalty, baseTokenURI, templateId },
    } = event;

    await this.updateHistory(event);

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

    await this.erc721LogService.add({
      address: [addr.toLowerCase()],
      topics: [],
    });
  }

  public async erc1155Token(event: IEvent<IContractManagerERC1155TokenDeployed>): Promise<void> {
    const {
      returnValues: { addr, baseTokenURI, templateId },
    } = event;

    await this.updateHistory(event);

    await this.erc1155CollectionService.create({
      address: addr.toLowerCase(),
      title: "new 1155 collection",
      description: emptyStateString,
      imageUrl,
      chainId: this.chainId,
      baseTokenURI,
      contractTemplate: Object.values(Erc1155TokenTemplate)[~~templateId],
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
