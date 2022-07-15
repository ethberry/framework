import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { IPaginationDto } from "@gemunion/types-collection";

import { GradeEntity } from "./grade.entity";
import { IDropboxUpdateDto } from "./interfaces";

@Injectable()
export class GradeService {
  constructor(
    @InjectRepository(GradeEntity)
    private readonly gradeEntityRepository: Repository<GradeEntity>,
  ) {}

  public async search(dto: IPaginationDto): Promise<[Array<GradeEntity>, number]> {
    const { skip, take } = dto;

    const queryBuilder = this.gradeEntityRepository.createQueryBuilder("grade");

    queryBuilder.select();

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    queryBuilder.orderBy({
      "dropbox.title": "ASC",
    });

    return queryBuilder.getManyAndCount();
  }

  public findOne(
    where: FindOptionsWhere<GradeEntity>,
    options?: FindOneOptions<GradeEntity>,
  ): Promise<GradeEntity | null> {
    return this.gradeEntityRepository.findOne({ where, ...options });
  }

  public async update(where: FindOptionsWhere<GradeEntity>, dto: Partial<IDropboxUpdateDto>): Promise<GradeEntity> {
    const templateEntity = await this.findOne(where);

    if (!templateEntity) {
      throw new NotFoundException("gradeNotFound");
    }

    Object.assign(templateEntity, dto);

    return templateEntity.save();
  }
}
