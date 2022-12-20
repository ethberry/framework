import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import type { IPaginationDto } from "@gemunion/types-collection";

import { GradeEntity } from "./grade.entity";
import { IGradeUpdateDto } from "./interfaces";
import { AssetService } from "../../exchange/asset/asset.service";

@Injectable()
export class GradeService {
  constructor(
    @InjectRepository(GradeEntity)
    private readonly gradeEntityRepository: Repository<GradeEntity>,
    protected readonly assetService: AssetService,
  ) {}

  public async search(dto: IPaginationDto): Promise<[Array<GradeEntity>, number]> {
    const { skip, take } = dto;

    const queryBuilder = this.gradeEntityRepository.createQueryBuilder("grade");

    queryBuilder.leftJoinAndSelect("grade.contract", "contract");

    queryBuilder.select();

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    queryBuilder.orderBy({
      "grade.createdAt": "DESC",
    });

    return queryBuilder.getManyAndCount();
  }

  public findOne(
    where: FindOptionsWhere<GradeEntity>,
    options?: FindOneOptions<GradeEntity>,
  ): Promise<GradeEntity | null> {
    return this.gradeEntityRepository.findOne({ where, ...options });
  }

  public async update(where: FindOptionsWhere<GradeEntity>, dto: Partial<IGradeUpdateDto>): Promise<GradeEntity> {
    const { price, ...rest } = dto;
    const templateEntity = await this.findOne(where, {
      join: {
        alias: "grade",
        leftJoinAndSelect: {
          price: "grade.price",
          components: "price.components",
        },
      },
    });

    if (!templateEntity) {
      throw new NotFoundException("gradeNotFound");
    }

    if (price) {
      await this.assetService.update(templateEntity.price, price);
    }

    Object.assign(templateEntity, rest);

    return templateEntity.save();
  }

  public findOneWithRelations(where: FindOptionsWhere<GradeEntity>): Promise<GradeEntity | null> {
    return this.findOne(where, {
      join: {
        alias: "grade",
        leftJoinAndSelect: {
          contract: "grade.contract",
          price: "grade.price",
          price_components: "price.components",
          price_contract: "price_components.contract",
          price_template: "price_components.template",
        },
      },
    });
  }
}
