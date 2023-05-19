import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { BigNumber } from "ethers";
import { BreedService } from "./breed.service";
import { decodeGenes, decodeNumber } from "@framework/genes";

@Injectable()
export class BreedServiceEth {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly configService: ConfigService,
    private readonly breedService: BreedService,
  ) {}

  public async newborn(tokenId: number, genes: string, transactionHash: string): Promise<void> {
    const { matronId, sireId } = decodeGenes(BigNumber.from(genes), ["matronId", "sireId"].reverse());
    const randomness = decodeNumber(BigNumber.from(genes)).slice(0, 6).join("");
    let newbornGenes = "";
    // GENESIS ITEM
    // TODO better check
    if (matronId === 0 && sireId === 0) {
      this.loggerService.log("MintedGenZero", tokenId, transactionHash.toLowerCase(), BreedServiceEth.name);
      // TODO gen validation
      newbornGenes = randomness;
    } else {
      // TODO make it in one db call -> .findAll()
      const mom = await this.breedService.findOne({ id: matronId });
      const dad = await this.breedService.findOne({ id: sireId });

      if (!mom || !dad) {
        this.loggerService.error(new NotFoundException("genesNotFound"), BreedServiceEth.name);
        throw new NotFoundException("genesNotFound");
      } else {
        // TODO better gene-mixing;
        // xxxxxxxxxxxx - random
        // mmmmmmmmmmmm - mom
        // dddddddddddd - dad
        // xxxmmmxxxddd - newborn
        // TODO subst deprecated
        const gen1 = randomness.substr(0, randomness.length / 4);
        const gen2 = mom.genes.substr(0, mom.genes.length / 4);
        const gen3 = randomness.substr(randomness.length - 1 - randomness.length / 4, randomness.length / 4);
        const gen4 = dad.genes.substr(dad.genes.length - 1 - dad.genes.length / 4, dad.genes.length / 4);
        newbornGenes = gen1 + gen2 + gen3 + gen4;
      }
    }

    const breedEntity = await this.breedService.create({
      tokenId,
      genes: newbornGenes,
      count: 0,
    });

    if (matronId > 0 && sireId > 0) {
      console.info(matronId, sireId, breedEntity.id, transactionHash);
    }
  }
}
