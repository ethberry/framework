import { Inject, Injectable, Logger, LoggerService } from "@nestjs/common";

import { IEvent } from "@gemunion/nestjs-web3";
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

@Injectable()
export class ContractManagerServiceWs {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly contractManagerHistoryService: ContractManagerHistoryService,
    private readonly erc20VestingService: Erc20VestingService,
    private readonly erc20TokenService: Erc20TokenService,
    private readonly erc721CollectionService: Erc721CollectionService,
    private readonly erc1155CollectionService: Erc1155CollectionService,
  ) {}

  public async erc20Vesting(event: IEvent<IContractManagerERC20VestingDeployed>): Promise<void> {
    const {
      returnValues: { addr, beneficiary, startTimestamp, duration },
    } = event;

    await this.updateHistory(event);

    await this.erc20VestingService.create({
      address: addr,
      beneficiary,
      startTimestamp: new Date(~~`${startTimestamp}000`).toISOString(),
      duration: ~~duration,
    });
  }

  public async erc20Token(event: IEvent<IContractManagerERC20TokenDeployed>): Promise<void> {
    const {
      returnValues: { addr, name, symbol, cap },
    } = event;

    await this.updateHistory(event);

    await this.erc20TokenService.create({ address: addr, title: name, symbol, amount: cap });
  }

  public async erc721Token(event: IEvent<IContractManagerERC721TokenDeployed>): Promise<void> {
    const {
      returnValues: { addr, name, symbol, royalty },
    } = event;

    await this.updateHistory(event);

    await this.erc721CollectionService.create({ address: addr, title: name, symbol, royalty: ~~royalty });
  }

  public async erc1155Token(event: IEvent<IContractManagerERC1155TokenDeployed>): Promise<void> {
    const {
      returnValues: { addr },
    } = event;

    await this.updateHistory(event);

    await this.erc1155CollectionService.create({ address: addr, title: "new 1155 collection" });
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
