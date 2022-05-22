import { Inject, Injectable, Logger, LoggerService } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { AbiItem } from "web3-utils";

import { Web3LogService } from "@gemunion/nestjs-web3";

import { Erc1155CollectionStatus } from "@framework/types";

import { Erc1155CollectionService } from "../collection/collection.service";
import { ICreateListenerPayload } from "./interfaces";

import ERC1155Simple from "@framework/binance-contracts/artifacts/contracts/ERC1155/ERC1155Simple.sol/ERC1155Simple.json";

@Injectable()
export class Erc1155LogService {
  private chainId: number;
  private abiArr: Array<AbiItem>;

  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly configService: ConfigService,
    private readonly erc1155CollectionService: Erc1155CollectionService,
    private readonly web3LogService: Web3LogService,
  ) {
    this.chainId = this.configService.get<number>("CHAIN_ID", 1337);
    this.abiArr = Object.values(
      ERC1155Simple.abi
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
    const erc1155CollectionEntities = await this.erc1155CollectionService.findAll({
      collectionStatus: Erc1155CollectionStatus.ACTIVE,
      chainId: this.chainId,
    });

    const listenAddrss = erc1155CollectionEntities.map(erc1155CollectionEntity => erc1155CollectionEntity.address);
    this.loggerService.log(`Listening@Erc1155: ${listenAddrss.toString()}`, Erc1155LogService.name);

    await this.web3LogService.listen({
      logOptions: {
        address: listenAddrss,
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
    const erc1155CollectionEntities = await this.erc1155CollectionService.findAll({
      collectionStatus: Erc1155CollectionStatus.ACTIVE,
      chainId: this.chainId,
    });
    const listenAddrss = dto.address
      ? erc1155CollectionEntities.map(erc1155CollectionEntity => erc1155CollectionEntity.address).concat(dto.address)
      : erc1155CollectionEntities.map(erc1155CollectionEntity => erc1155CollectionEntity.address);
    this.loggerService.log(`Listening@Erc1155: ${listenAddrss.toString()}`, Erc1155LogService.name);
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
