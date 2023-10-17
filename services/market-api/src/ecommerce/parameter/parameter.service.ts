import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, DeleteResult, FindOptionsWhere, Repository } from "typeorm";

import type { ISearchDto } from "@gemunion/types-collection";

import { ParameterEntity } from "./parameter.entity";
import type { IParameterCreateDto, IParameterUpdateDto } from "./interfaces";

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
      queryBuilder.andWhere(
        new Brackets(qb => {
          qb.where("parameter.parameterName ILIKE '%' || :parameterName || '%'", { parameterName: query });
        }),
      );
    }

    queryBuilder.orderBy("parameter.id", "DESC");

    return queryBuilder.getManyAndCount();
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
