import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, DeleteResult, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { OwnershipEntity } from "./ownership.entity";

@Injectable()
export class OwnershipService {
  constructor(
    @InjectRepository(OwnershipEntity)
    private readonly ownershipEntityRepository: Repository<OwnershipEntity>,
  ) {}

  public findOne(
    where: FindOptionsWhere<OwnershipEntity>,
    options?: FindOneOptions<OwnershipEntity>,
  ): Promise<OwnershipEntity | null> {
    return this.ownershipEntityRepository.findOne({ where, ...options });
  }

  public create(dto: DeepPartial<OwnershipEntity>): Promise<OwnershipEntity> {
    return this.ownershipEntityRepository.create(dto).save();
  }

  public delete(where: FindOptionsWhere<OwnershipEntity>): Promise<DeleteResult> {
    return this.ownershipEntityRepository.delete(where);
  }
}
