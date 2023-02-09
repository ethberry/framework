import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, FindOneOptions, FindOptionsWhere, IsNull, Repository } from "typeorm";

import { BreedHistoryEntity } from "./history.entity";
import { ContractHistoryService } from "../../../hierarchy/contract/history/history.service";
import { ContractEventType, IERC721TokenMintRandomEvent } from "@framework/types";

@Injectable()
export class BreedHistoryService {
  constructor(
    @InjectRepository(BreedHistoryEntity)
    private readonly breedHistoryEntityRepository: Repository<BreedHistoryEntity>,
    protected readonly contractHistoryService: ContractHistoryService,
  ) {}

  public findOne(
    where: FindOptionsWhere<BreedHistoryEntity>,
    options?: FindOneOptions<BreedHistoryEntity>,
  ): Promise<BreedHistoryEntity | null> {
    return this.breedHistoryEntityRepository.findOne({ where, ...options });
  }

  public async create(dto: DeepPartial<BreedHistoryEntity>): Promise<BreedHistoryEntity> {
    return this.breedHistoryEntityRepository.create(dto).save();
  }

  public async update(
    where: FindOptionsWhere<BreedHistoryEntity>,
    dto: DeepPartial<BreedHistoryEntity>,
  ): Promise<BreedHistoryEntity> {
    const historyEntity = await this.findOne(where, { relations: { history: true } });

    if (!historyEntity) {
      throw new NotFoundException("historyNotFound");
    }

    Object.assign(historyEntity, dto);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return historyEntity.save();
  }

  public async updateHistory(
    matronId: number,
    sireId: number,
    childId: number,
    transactionHash: string,
  ): Promise<void> {
    const randomHistory = await this.contractHistoryService.findOne({
      transactionHash,
      eventType: ContractEventType.MintRandom,
    });
    if (!randomHistory) {
      throw new NotFoundException("historyNotFound");
    }
    const eventData = randomHistory.eventData as IERC721TokenMintRandomEvent;

    const requestHistory = await this.contractHistoryService.findByRandomRequest(eventData.requestId);
    if (requestHistory) {
      const transactionHash = requestHistory.transactionHash;

      const queryBuilder = this.breedHistoryEntityRepository.createQueryBuilder("breeds");
      queryBuilder.select();
      queryBuilder.leftJoinAndSelect("breeds.history", "history");
      queryBuilder.where({ matronId, sireId, childId: IsNull() });
      queryBuilder.andWhere("history.transactionHash = :transactionHash", {
        transactionHash,
      });

      const breedHistoryEntity = await queryBuilder.getOne();

      if (breedHistoryEntity) {
        Object.assign(breedHistoryEntity, { childId });
        await breedHistoryEntity.save();
      }
    }
  }
}
