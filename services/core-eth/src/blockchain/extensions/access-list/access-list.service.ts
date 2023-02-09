import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

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

  public async remove(dto: FindOptionsWhere<AccessListEntity>): Promise<AccessListEntity> {
    const accessListEntity = await this.findOne(dto);

    if (!accessListEntity) {
      throw new NotFoundException("blacklistNotFound");
    }

    return accessListEntity.remove();
  }
}
