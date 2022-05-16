import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { Erc721CollectionEntity } from "./collection.entity";

@Injectable()
export class Erc721CollectionService {
  constructor(
    @InjectRepository(Erc721CollectionEntity)
    private readonly erc721CollectionEntityRepository: Repository<Erc721CollectionEntity>,
  ) {}

  public findOne(
    where: FindOptionsWhere<Erc721CollectionEntity>,
    options?: FindOneOptions<Erc721CollectionEntity>,
  ): Promise<Erc721CollectionEntity | null> {
    return this.erc721CollectionEntityRepository.findOne({ where, ...options });
  }

  public async create(dto: DeepPartial<Erc721CollectionEntity>): Promise<Erc721CollectionEntity> {
    return this.erc721CollectionEntityRepository.create(dto).save();
  }
}
