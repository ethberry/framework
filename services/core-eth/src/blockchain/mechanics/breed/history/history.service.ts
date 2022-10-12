import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, FindOneOptions, FindOptionsWhere, Repository, IsNull } from "typeorm";

import { BreedHistoryEntity } from "./history.entity";

@Injectable()
export class BreedHistoryService {
  constructor(
    @InjectRepository(BreedHistoryEntity)
    private readonly breedHistoryEntityRepository: Repository<BreedHistoryEntity>,
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
    const historyEntity = await this.findOne(where);

    if (!historyEntity) {
      throw new NotFoundException("historyNotFound");
    }

    Object.assign(historyEntity, dto);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return historyEntity.save();
  }

  public async updateHistory(matronId: number, sireId: number, childId: number): Promise<BreedHistoryEntity> {
    return await this.update({ matronId, sireId, childId: IsNull() }, { childId });
  }
}
