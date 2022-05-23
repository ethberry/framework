import { Inject, Injectable, Logger, LoggerService } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { Web3LogService } from "@gemunion/nestjs-web3";

import { Erc721CollectionStatus, Erc721CollectionType } from "@framework/types";

import { Erc721CollectionService } from "../collection/collection.service";
import { ICreateListenerPayload } from "./interfaces";

import { ERC721FullEvents } from "./interfaces/abi";

@Injectable()
export class Erc721LogService {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly configService: ConfigService,
    private readonly erc721CollectionService: Erc721CollectionService,
    private readonly web3LogService: Web3LogService,
  ) {}

  public async init(): Promise<void> {
    const chainId = this.configService.get<number>("CHAIN_ID", 1337);
    const erc721CollectionEntities = await this.erc721CollectionService.findAll({
      collectionStatus: Erc721CollectionStatus.ACTIVE,
      collectionType: Erc721CollectionType.TOKEN,
      chainId,
    });

    const listenAddrss = erc721CollectionEntities.map(erc721CollectionEntity => erc721CollectionEntity.address);
    this.loggerService.log(`Listening@Erc721: ${listenAddrss.toString()}`, Erc721LogService.name);

    await this.web3LogService.listen({
      logOptions: {
        address: erc721CollectionEntities.map(erc721CollectionEntity => erc721CollectionEntity.address),
        topics: [],
      },
      contractInterface: ERC721FullEvents,
    });
  }

  public async update(dto: ICreateListenerPayload): Promise<void> {
    await this.web3LogService.unsubscribe();

    await this.web3LogService.listen({
      logOptions: dto,
      contractInterface: ERC721FullEvents,
    });
  }

  public async add(dto: ICreateListenerPayload): Promise<void> {
    const chainId = this.configService.get<number>("CHAIN_ID", 1337);
    const erc721CollectionEntities = await this.erc721CollectionService.findAll({
      collectionStatus: Erc721CollectionStatus.ACTIVE,
      collectionType: Erc721CollectionType.TOKEN,
      chainId,
    });
    const listenAddrss = dto.address
      ? erc721CollectionEntities.map(erc721CollectionEntity => erc721CollectionEntity.address).concat(dto.address)
      : erc721CollectionEntities.map(erc721CollectionEntity => erc721CollectionEntity.address);
    this.loggerService.log(`Listening@Erc721: ${listenAddrss.toString()}`, Erc721LogService.name);
    await this.web3LogService.unsubscribe();

    await this.web3LogService.listen({
      logOptions: {
        address: listenAddrss,
        topics: dto.topics,
      },
      contractInterface: ERC721FullEvents,
    });
  }
}
