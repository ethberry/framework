import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, DeleteResult, FindOptionsWhere, Repository } from "typeorm";

import { ISearchDto } from "@gemunion/types-collection";

import { CustomParameterEntity } from "./custom-parameter.entity";
import type { ICustomParameterCreateDto, ICustomParameterUpdateDto } from "./interfaces";

@Injectable()
export class CustomParameterService {
  constructor(
    @InjectRepository(CustomParameterEntity)
    private readonly customParameterEntityRepository: Repository<CustomParameterEntity>,
  ) {}

  public search(dto: ISearchDto): Promise<[Array<CustomParameterEntity>, number]> {
    const { query } = dto;

    const queryBuilder = this.customParameterEntityRepository.createQueryBuilder("parameter");

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

  public async create(dto: ICustomParameterCreateDto): Promise<CustomParameterEntity> {
    return this.customParameterEntityRepository.create(dto).save();
  }

  public async update(
    where: FindOptionsWhere<CustomParameterEntity>,
    data: ICustomParameterUpdateDto,
  ): Promise<CustomParameterEntity> {
    const customParameterEntity = await this.customParameterEntityRepository.findOne({ where });

    if (!customParameterEntity) {
      throw new NotFoundException("customParameterNotFound");
    }

    Object.assign(customParameterEntity, { ...data });
    return customParameterEntity.save();
  }

  public delete(where: FindOptionsWhere<CustomParameterEntity>): Promise<DeleteResult> {
    return this.customParameterEntityRepository.delete(where);
  }
}
