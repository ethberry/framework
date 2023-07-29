import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { AccessControlEntity } from "./access-control.entity";
import { IAccessControlCheckDto } from "./interfaces";

@Injectable()
export class AccessControlService {
  constructor(
    @InjectRepository(AccessControlEntity)
    private readonly accessControlEntityRepository: Repository<AccessControlEntity>,
  ) {}

  public async create(dto: DeepPartial<AccessControlEntity>): Promise<AccessControlEntity> {
    return this.accessControlEntityRepository.create(dto).save();
  }

  public findOne(
    where: FindOptionsWhere<AccessControlEntity>,
    options?: FindOneOptions<AccessControlEntity>,
  ): Promise<AccessControlEntity | null> {
    return this.accessControlEntityRepository.findOne({ where, ...options });
  }

  public findAll(
    where: FindOptionsWhere<AccessControlEntity>,
    options?: FindOneOptions<AccessControlEntity>,
  ): Promise<Array<AccessControlEntity>> {
    return this.accessControlEntityRepository.find({ where, ...options });
  }

  public count(where: FindOptionsWhere<AccessControlEntity>): Promise<number> {
    return this.accessControlEntityRepository.count({ where });
  }

  public async check(dto: IAccessControlCheckDto): Promise<{ hasRole: boolean }> {
    const count = await this.count(dto);
    return { hasRole: count > 0 };
  }
}
