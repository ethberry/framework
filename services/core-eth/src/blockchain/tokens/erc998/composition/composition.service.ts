import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository, DeleteResult, DeepPartial } from "typeorm";

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

  public async create(dto: DeepPartial<CompositionEntity>): Promise<CompositionEntity> {
    return this.compositionEntityRepository.create(dto).save();
  }

  public delete(where: FindOptionsWhere<CompositionEntity>): Promise<DeleteResult> {
    return this.compositionEntityRepository.delete(where);
  }
}
