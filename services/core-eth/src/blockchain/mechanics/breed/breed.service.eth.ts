import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { BigNumber } from "ethers";

import type { ILogEvent } from "@gemunion/nestjs-ethers";
import { IExchangeBreedEvent } from "@framework/types";

import { BreedHistoryService } from "./history/history.service";
import { BreedService } from "./breed.service";
import { ContractService } from "../../hierarchy/contract/contract.service";
import { TokenService } from "../../hierarchy/token/token.service";
import { decodeGenes, decodeNumber } from "@framework/genes";

@Injectable()
export class BreedServiceEth {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly configService: ConfigService,
    private readonly breedService: BreedService,
    private readonly breedHistoryService: BreedHistoryService,
    private readonly contractService: ContractService,
    private readonly tokenService: TokenService,
  ) {}

  public async breed(event: ILogEvent<IExchangeBreedEvent>, historyId: number): Promise<void> {
    const { args } = event;
    const { from, matron, sire } = args;
    // const [matronType, matronTokenAddr, matronTokenId, matronAmount] = matron;
    const matronTokenAddr = matron[1].toLowerCase();
    const matronTokenId = matron[2];
    // const [sireType, sireTokenAddr, sireTokenId, sireAmount] = sire;
    const sireTokenAddr = sire[1].toLowerCase();
    const sireTokenId = sire[2];

    const matronTokenEntity = await this.tokenService.getToken(matronTokenId, matronTokenAddr);

    if (!matronTokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    const sireTokenEntity = await this.tokenService.getToken(sireTokenId, sireTokenAddr);

    if (!sireTokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    const breedMatronEntity = await this.breedService.append(matronTokenEntity.id);
    const breedSireEntity = await this.breedService.append(sireTokenEntity.id);

    await this.breedHistoryService.create({
      historyId,
      account: from,
      matronId: breedMatronEntity.id,
      sireId: breedSireEntity.id,
    });
  }

  public async newborn(tokenId: number, genes: string, transactionHash: string): Promise<void> {
    const { matronId, sireId } = decodeGenes(BigNumber.from(genes), ["matronId", "sireId"].reverse());
    const randomness = decodeNumber(BigNumber.from(genes)).slice(0, 6).join("");
    const mom = await this.breedService.findOne({ id: matronId });
    const dad = await this.breedService.findOne({ id: sireId });

    if (!mom || !dad) {
      throw new NotFoundException("genesNotFound");
    }

    // TODO better gene-mixing;
    // xxxxxxxxxxxx - random
    // mmmmmmmmmmmm - mom
    // dddddddddddd - dad
    // xxxmmmxxxddd - newborn
    const gen1 = randomness.substr(0, randomness.length / 4);
    const gen2 = mom.genes.substr(0, mom.genes.length / 4);
    const gen3 = randomness.substr(randomness.length - 1 - randomness.length / 4, randomness.length / 4);
    const gen4 = dad.genes.substr(dad.genes.length - 1 - dad.genes.length / 4, dad.genes.length / 4);
    const newbornGenes = gen1 + gen2 + gen3 + gen4;

    const breedEntity = await this.breedService.create({
      tokenId,
      genes: newbornGenes,
      count: 0,
    });

    if (matronId > 0 && sireId > 0) {
      await this.breedHistoryService.updateHistory(matronId, sireId, breedEntity.id, transactionHash);
    }
  }
}
