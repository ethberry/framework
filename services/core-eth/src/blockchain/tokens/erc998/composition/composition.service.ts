import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, DeleteResult, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { CompositionEntity } from "./composition.entity";

@Injectable()
export class Erc998CompositionService {
  constructor(
    @InjectRepository(CompositionEntity)
    protected readonly compositionEntityRepository: Repository<CompositionEntity>,
  ) {}

  public findOne(
    where: FindOptionsWhere<CompositionEntity>,
    options?: FindOneOptions<CompositionEntity>,
  ): Promise<CompositionEntity | null> {
    return this.compositionEntityRepository.findOne({ where, ...options });
  }

  public create(dto: DeepPartial<CompositionEntity>): Promise<CompositionEntity> {
    return this.compositionEntityRepository.create(dto).save();
  }

  public async update(
    where: FindOptionsWhere<CompositionEntity>,
    dto: Partial<CompositionEntity>,
  ): Promise<CompositionEntity> {
    const contractManagerEntity = await this.findOne(where);

    if (!contractManagerEntity) {
      throw new NotFoundException("entityNotFound");
    }

    Object.assign(contractManagerEntity, dto);

    return contractManagerEntity.save();
  }

  public async upsert(dto: DeepPartial<CompositionEntity>): Promise<void> {
    const { parentId, childId, amount } = dto;
    const compositionEntity = await this.findOne({ parentId, childId });

    if (compositionEntity) {
      if (compositionEntity.amount !== amount) {
        Object.assign(compositionEntity, { amount });
        await compositionEntity.save();
      }
    } else {
      await this.create(dto);
    }
  }

  public async delete(where: FindOptionsWhere<CompositionEntity>): Promise<DeleteResult> {
    return await this.compositionEntityRepository.delete(where);
  }
}
