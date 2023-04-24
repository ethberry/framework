import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, FindManyOptions, FindOptionsWhere, Repository } from "typeorm";

import { ParameterEntity } from "./parameter.entity";
import { IParameterCreateDto, IParameterUpdateDto } from "./interfaces";
import { IParameterEnumDto } from "./interfaces/enum";

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

  public findOne(where: FindOptionsWhere<ParameterEntity>): Promise<ParameterEntity | null> {
    return this.parameterEntityRepository.findOne({ where });
  }

  public async create(dto: IParameterCreateDto): Promise<ParameterEntity> {
    return this.parameterEntityRepository.create(dto).save();
  }

  public async getNames(): Promise<string[]> {
    const queryBuilder = this.parameterEntityRepository.createQueryBuilder("parameter");

    queryBuilder.select(["parameter.parameterName"]);

    return queryBuilder
      .getRawMany()
      .then(json => [...new Set(json.map(({ parameter_parameter_name }) => parameter_parameter_name as string))]);
  }

  public async getEnum(dto: IParameterEnumDto): Promise<string[]> {
    const { parameterName } = dto;

    const queryBuilder = this.parameterEntityRepository.createQueryBuilder("parameter");

    queryBuilder.select(["parameter.parameterValue"]);

    queryBuilder.andWhere("parameter.parameterName = :parameterName", {
      parameterName,
    });

    return queryBuilder
      .getRawMany()
      .then(json => [...new Set(json.map(({ parameter_parameter_value }) => parameter_parameter_value as string))]);
  }

  public async update(where: FindOptionsWhere<ParameterEntity>, data: IParameterUpdateDto): Promise<ParameterEntity> {
    const parameterEntity = await this.parameterEntityRepository.findOne({ where });

    if (!parameterEntity) {
      throw new NotFoundException("parameterNotFound");
    }

    Object.assign(parameterEntity, { ...data });
    return parameterEntity.save();
  }

  public count(where: FindOptionsWhere<ParameterEntity>): Promise<number> {
    return this.parameterEntityRepository.count({ where });
  }

  public delete(where: FindOptionsWhere<ParameterEntity>): Promise<DeleteResult> {
    return this.parameterEntityRepository.delete(where);
  }
}
