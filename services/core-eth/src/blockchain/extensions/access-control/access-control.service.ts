import { Injectable } from "@nestjs/common";
// import { Injectable, NotFoundException } from "@nestjs/common";
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

  // TODO update role status?
  // public async update(
  //   where: FindOptionsWhere<AccessControlEntity>,
  //   dto: DeepPartial<AccessControlEntity>,
  // ): Promise<AccessControlEntity> {
  //   const { ...rest } = dto;
  //
  //   const accessControlEntity = await this.findOne(where);
  //
  //   if (!accessControlEntity) {
  //     throw new NotFoundException("accessControlRecordNotFound");
  //   }
  //
  //   Object.assign(accessControlEntity, rest);
  //
  //   return accessControlEntity.save();
  // }

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
