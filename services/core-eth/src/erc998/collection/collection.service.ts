import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { Erc998CollectionEntity } from "./collection.entity";

@Injectable()
export class Erc998CollectionService {
  constructor(
    @InjectRepository(Erc998CollectionEntity)
    private readonly erc998CollectionEntityRepository: Repository<Erc998CollectionEntity>,
  ) {}

  public findOne(
    where: FindOptionsWhere<Erc998CollectionEntity>,
    options?: FindOneOptions<Erc998CollectionEntity>,
  ): Promise<Erc998CollectionEntity | null> {
    return this.erc998CollectionEntityRepository.findOne({ where, ...options });
  }

  public findAll(
    where: FindOptionsWhere<Erc998CollectionEntity>,
    options?: FindOneOptions<Erc998CollectionEntity>,
  ): Promise<Array<Erc998CollectionEntity>> {
    return this.erc998CollectionEntityRepository.find({ where, ...options });
  }

  public async create(dto: DeepPartial<Erc998CollectionEntity>): Promise<Erc998CollectionEntity> {
    return this.erc998CollectionEntityRepository.create(dto).save();
  }
}
