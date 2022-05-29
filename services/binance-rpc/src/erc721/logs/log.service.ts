import { Inject, Injectable, Logger, LoggerService } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { Web3LogService } from "@gemunion/nestjs-web3";

import { Erc721CollectionStatus, Erc721CollectionType } from "@framework/types";

import { Erc721CollectionService } from "../collection/collection.service";
import { ERC721FullEvents, ICreateListenerPayload } from "./interfaces";

@Injectable()
export class Erc721LogService {
  private chainId: number;
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly configService: ConfigService,
    private readonly erc721CollectionService: Erc721CollectionService,
    private readonly web3LogService: Web3LogService,
  ) {
    this.chainId = ~~this.configService.get<string>("CHAIN_ID", "1337");
  }

  public async init(): Promise<void> {
    const erc721CollectionEntities = await this.erc721CollectionService.findAll({
      collectionStatus: Erc721CollectionStatus.ACTIVE,
      collectionType: Erc721CollectionType.TOKEN,
      chainId: this.chainId,
    });

    const listenAddrss = erc721CollectionEntities.map(erc721CollectionEntity => erc721CollectionEntity.address);

    if (listenAddrss.length > 0) {
      await this.web3LogService.listen({
        logOptions: {
          address: erc721CollectionEntities.map(erc721CollectionEntity => erc721CollectionEntity.address),
          topics: [],
        },
        contractInterface: ERC721FullEvents,
      });
      this.loggerService.log(`Listening@Erc721: ${listenAddrss.toString()}`, Erc721LogService.name);
    }
  }

  public async update(dto: ICreateListenerPayload): Promise<void> {
    await this.web3LogService.unsubscribe();

    if (dto.address.length > 0) {
      await this.web3LogService.listen({
        logOptions: dto,
        contractInterface: ERC721FullEvents,
      });
      this.loggerService.log(`Listening@Erc721: ${dto.address.toString()}`, Erc721LogService.name);
    }
  }

  public async add(dto: ICreateListenerPayload): Promise<void> {
    const erc721CollectionEntities = await this.erc721CollectionService.findAll({
      collectionStatus: Erc721CollectionStatus.ACTIVE,
      collectionType: Erc721CollectionType.TOKEN,
      chainId: this.chainId,
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
