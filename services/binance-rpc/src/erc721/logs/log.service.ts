import { Inject, Injectable, Logger, LoggerService } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { AbiItem } from "web3-utils";

import { Web3LogService } from "@gemunion/nestjs-web3";

import { Erc721CollectionStatus, Erc721CollectionType } from "@framework/types";

import { Erc721CollectionService } from "../collection/collection.service";
import { ICreateListenerPayload } from "./interfaces";

import ERC721Graded from "@framework/binance-contracts/artifacts/contracts/ERC721/ERC721Graded.sol/ERC721Graded.json";
import ERC721Random from "@framework/binance-contracts/artifacts/contracts/ERC721/ERC721Random.sol/ERC721Random.json";
import ERC721Simple from "@framework/binance-contracts/artifacts/contracts/ERC721/ERC721Simple.sol/ERC721Simple.json";
// import ERC721Airdrop from "@framework/binance-contracts/artifacts/contracts/ERC721/ERC721Airdrop.sol/ERC721Airdrop.json";
// import ERC721Dropbox from "@framework/binance-contracts/artifacts/contracts/ERC721/ERC721Dropbox.sol/ERC721Dropbox.json";

@Injectable()
export class Erc721LogService {
  private chainId: number;
  private abiArr: Array<AbiItem>;

  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly configService: ConfigService,
    private readonly erc721CollectionService: Erc721CollectionService,
    private readonly web3LogService: Web3LogService,
  ) {
    this.chainId = this.configService.get<number>("CHAIN_ID", 1337);
    this.abiArr = Object.values(
      ERC721Simple.abi
        .concat(ERC721Graded.abi)
        .concat(ERC721Random.abi)
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
    const erc721CollectionEntities = await this.erc721CollectionService.findAll({
      collectionStatus: Erc721CollectionStatus.ACTIVE,
      collectionType: Erc721CollectionType.TOKEN,
      chainId: this.chainId,
    });

    const listenAddrss = erc721CollectionEntities.map(erc721CollectionEntity => erc721CollectionEntity.address);
    this.loggerService.log(`Listening@Erc721: ${listenAddrss.toString()}`, Erc721LogService.name);

    await this.web3LogService.listen({
      logOptions: {
        address: erc721CollectionEntities.map(erc721CollectionEntity => erc721CollectionEntity.address),
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
      contractInterface: this.abiArr,
    });
  }
}
