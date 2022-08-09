import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { ICompositionSearchDto } from "@framework/types";

import { CompositionEntity } from "./composition.entity";

@Injectable()
export class Erc998CompositionService {
  constructor(
    @InjectRepository(CompositionEntity)
    protected readonly compositionEntityRepository: Repository<CompositionEntity>,
  ) {}

  public async search(dto: ICompositionSearchDto): Promise<[Array<CompositionEntity>, number]> {
    const { parentIds, childIds, skip, take } = dto;

    const queryBuilder = this.compositionEntityRepository.createQueryBuilder("composition");

    queryBuilder.select();

    queryBuilder.leftJoinAndSelect("composition.parent", "parent");
    queryBuilder.leftJoinAndSelect("composition.child", "child");

    if (parentIds) {
      if (parentIds.length === 1) {
        queryBuilder.andWhere("composition.parentId = :parentId", {
          parentId: parentIds[0],
        });
      } else {
        queryBuilder.andWhere("composition.parentId IN(:...parentIds)", { parentIds });
      }
    }

    if (childIds) {
      if (childIds.length === 1) {
        queryBuilder.andWhere("composition.childId = :childId", {
          childId: childIds[0],
        });
      } else {
        queryBuilder.andWhere("composition.childId IN(:...childIds)", { childIds });
      }
    }

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    queryBuilder.orderBy({
      "composition.createdAt": "DESC",
    });

    return queryBuilder.getManyAndCount();
  }

  public findOne(
    where: FindOptionsWhere<CompositionEntity>,
    options?: FindOneOptions<CompositionEntity>,
  ): Promise<CompositionEntity | null> {
    return this.compositionEntityRepository.findOne({ where, ...options });
  }
}
