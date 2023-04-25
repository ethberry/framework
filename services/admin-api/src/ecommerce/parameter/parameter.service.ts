import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, FindManyOptions, FindOptionsWhere, Repository } from "typeorm";

import { ParameterEntity } from "./parameter.entity";
import { IParameterCreateDto, IParameterUpdateDto } from "./interfaces";

@Injectable()
export class ParameterService {
  constructor(
    @InjectRepository(ParameterEntity)
    private readonly parameterEntityRepository: Repository<ParameterEntity>,
  ) {}

  public search(): Promise<[Array<ParameterEntity>, number]> {
    return this.findAndCount({});
  }

  public findAndCount(
    where: FindOptionsWhere<ParameterEntity>,
    options?: FindManyOptions<ParameterEntity>,
  ): Promise<[Array<ParameterEntity>, number]> {
    return this.parameterEntityRepository.findAndCount({ where, ...options });
  }

  public async create(dto: IParameterCreateDto): Promise<ParameterEntity> {
    return this.parameterEntityRepository.create(dto).save();
  }

  public async update(where: FindOptionsWhere<ParameterEntity>, data: IParameterUpdateDto): Promise<ParameterEntity> {
    const parameterEntity = await this.parameterEntityRepository.findOne({ where });

    if (!parameterEntity) {
      throw new NotFoundException("parameterNotFound");
    }

    Object.assign(parameterEntity, { ...data });
    return parameterEntity.save();
  }

  public delete(where: FindOptionsWhere<ParameterEntity>): Promise<DeleteResult> {
    return this.parameterEntityRepository.delete(where);
  }
}
