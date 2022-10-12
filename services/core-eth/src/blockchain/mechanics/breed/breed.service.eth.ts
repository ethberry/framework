import { Inject, Injectable, Logger, LoggerService, NotFoundException, UnprocessableEntityException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import type { ILogEvent } from "@gemunion/nestjs-ethers";
import { IExchangeBreedEvent } from "@framework/types";

import { BreedHistoryService } from "./history/history.service";
import { BreedService } from "./breed.service";
import { ContractService } from "../../hierarchy/contract/contract.service";
import { TokenService } from "../../hierarchy/token/token.service";

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

  public async breed(event: ILogEvent<IExchangeBreedEvent>): Promise<void> {
    const { args } = event;
    const { from, externalId, matron, sire } = args;
    const [matronType, matronTokenAddr, matronTokenId, matronAmount] = matron;
    const [sireType, sireTokenAddr, sireTokenId, sireAmount] = sire;

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
      account: from,
      matronId: breedMatronEntity.id,
      sireId: breedSireEntity.id,
    });
  }

  public async newborn(tokenId: number, genes: string): Promise<void> {
    const { matronId, sireId, randomness } = this.decodeGenetics(genes);
    const breedEntity = await this.breedService.create({
      tokenId,
      genes: randomness,
    });

    await this.breedHistoryService.updateHistory(~~matronId, ~~sireId, breedEntity.id);
  }

  public decodeGenetics = (encoded: string) => {
    if (encoded.length === 256) {
      return {
        templateId: encoded.substr(0, 32),
        matronId: encoded.substr(32, 32),
        sireId: encoded.substr(64, 32),
        randomness: encoded.substr(96, 160),
      };
    } else throw new UnprocessableEntityException("genesMismatch");
  };
}
