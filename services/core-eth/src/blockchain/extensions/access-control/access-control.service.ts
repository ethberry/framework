import { Injectable } from "@nestjs/common";

import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, DeleteResult, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { AccessControlEntity } from "./access-control.entity";

@Injectable()
export class AccessControlService {
  constructor(
    @InjectRepository(AccessControlEntity)
    private readonly accessControlEntityRepository: Repository<AccessControlEntity>,
  ) {}

  public async create(dto: DeepPartial<AccessControlEntity>): Promise<AccessControlEntity> {
    return this.accessControlEntityRepository.create(dto).save();
  }

  public async delete(where: FindOptionsWhere<AccessControlEntity>): Promise<DeleteResult> {
    return this.accessControlEntityRepository.delete(where);
  }

  public findOne(
    where: FindOptionsWhere<AccessControlEntity>,
    options?: FindOneOptions<AccessControlEntity>,
  ): Promise<AccessControlEntity | null> {
    return this.accessControlEntityRepository.findOne({ where, ...options });
  }
}
