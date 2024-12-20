import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, FindManyOptions, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { AccessListEntity } from "./access-list.entity";

@Injectable()
export class AccessListService {
  constructor(
    @InjectRepository(AccessListEntity)
    private readonly accessListEntityRepository: Repository<AccessListEntity>,
  ) {}

  public async create(dto: DeepPartial<AccessListEntity>): Promise<AccessListEntity> {
    return this.accessListEntityRepository.create(dto).save();
  }

  public findOne(
    where: FindOptionsWhere<AccessListEntity>,
    options?: FindOneOptions<AccessListEntity>,
  ): Promise<AccessListEntity | null> {
    return this.accessListEntityRepository.findOne({ where, ...options });
  }

  public findAll(
    where: FindOptionsWhere<AccessListEntity>,
    options?: FindManyOptions<AccessListEntity>,
  ): Promise<Array<AccessListEntity>> {
    return this.accessListEntityRepository.find({ where, ...options });
  }
}
