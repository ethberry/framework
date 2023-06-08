import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { ISearchDto } from "@gemunion/types-collection";

import { ParameterEntity } from "./parameter.entity";
import { IParameterCreateDto, IParameterUpdateDto } from "./interfaces";

@Injectable()
export class ParameterService {
  constructor(
    @InjectRepository(ParameterEntity)
    private readonly parameterEntityRepository: Repository<ParameterEntity>,
  ) {}

  public search(dto: ISearchDto): Promise<[Array<ParameterEntity>, number]> {
    const { query } = dto;

    const queryBuilder = this.parameterEntityRepository.createQueryBuilder("parameter");

    queryBuilder.select();

    if (query) {
      queryBuilder.andWhere("parameter.parameterName ILIKE '%' || :parameterName || '%'", { parameterName: query });
    }

    queryBuilder.orderBy("parameter.id", "DESC");

    return queryBuilder.getManyAndCount();
  }

  public findOne(
    where: FindOptionsWhere<ParameterEntity>,
    options?: FindOneOptions<ParameterEntity>,
  ): Promise<ParameterEntity | null> {
    return this.parameterEntityRepository.findOne({ where, ...options });
  }

  public async create(dto: IParameterCreateDto): Promise<ParameterEntity> {
    return this.parameterEntityRepository.create(dto).save();
  }

  public async update(where: FindOptionsWhere<ParameterEntity>, dto: IParameterUpdateDto): Promise<ParameterEntity> {
    const parameterEntity = await this.parameterEntityRepository.findOne({ where });

    if (!parameterEntity) {
      throw new NotFoundException("parameterNotFound");
    }

    Object.assign(parameterEntity, { ...dto });
    return parameterEntity.save();
  }

  public delete(where: FindOptionsWhere<ParameterEntity>): Promise<DeleteResult> {
    return this.parameterEntityRepository.delete(where);
  }
}