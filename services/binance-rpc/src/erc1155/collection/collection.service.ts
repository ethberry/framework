import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { Erc1155CollectionEntity } from "./collection.entity";
import { Erc721CollectionEntity } from "../../erc721/collection/collection.entity";

@Injectable()
export class Erc1155CollectionService {
  constructor(
    @InjectRepository(Erc1155CollectionEntity)
    private readonly erc1155CollectionEntityRepository: Repository<Erc1155CollectionEntity>,
  ) {}

  public findOne(
    where: FindOptionsWhere<Erc1155CollectionEntity>,
    options?: FindOneOptions<Erc1155CollectionEntity>,
  ): Promise<Erc1155CollectionEntity | null> {
    return this.erc1155CollectionEntityRepository.findOne({ where, ...options });
  }

  public findAll(
    where: FindOptionsWhere<Erc1155CollectionEntity>,
    options?: FindOneOptions<Erc1155CollectionEntity>,
  ): Promise<Array<Erc1155CollectionEntity>> {
    return this.erc1155CollectionEntityRepository.find({ where, ...options });
  }

  public async create(dto: DeepPartial<Erc1155CollectionEntity>): Promise<Erc1155CollectionEntity> {
    return this.erc1155CollectionEntityRepository.create(dto).save();
  }
}
