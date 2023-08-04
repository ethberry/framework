import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { ICompositionSearchDto } from "@framework/types";

import { UserEntity } from "../../../../infrastructure/user/user.entity";
import { CompositionEntity } from "./composition.entity";

@Injectable()
export class Erc998CompositionService {
  constructor(
    @InjectRepository(CompositionEntity)
    protected readonly compositionEntityRepository: Repository<CompositionEntity>,
  ) {}

  public async search(
    dto: Partial<ICompositionSearchDto>,
    userEntity: UserEntity,
  ): Promise<[Array<CompositionEntity>, number]> {
    const { parentIds, childIds, query, skip, take } = dto;

    const queryBuilder = this.compositionEntityRepository.createQueryBuilder("composition");

    queryBuilder.select();

    queryBuilder.leftJoinAndSelect("composition.child", "child");
    queryBuilder.leftJoinAndSelect("composition.parent", "parent");

    if (query) {
      queryBuilder.leftJoin(
        qb => {
          qb.getQuery = () => `LATERAL json_array_elements(child.description->'blocks')`;
          return qb;
        },
        `child_blocks`,
        `TRUE`,
      );
      queryBuilder.leftJoin(
        qb => {
          qb.getQuery = () => `LATERAL json_array_elements(parent.description->'blocks')`;
          return qb;
        },
        `parent_blocks`,
        `TRUE`,
      );
      queryBuilder.andWhere(
        new Brackets(qb => {
          qb.where("child.title ILIKE '%' || :title || '%'", { title: query });
          qb.orWhere("child_blocks->>'text' ILIKE '%' || :description || '%'", { description: query });
          qb.orWhere("parent.title ILIKE '%' || :title || '%'", { title: query });
          qb.orWhere("parent_blocks->>'text' ILIKE '%' || :description || '%'", { description: query });
        }),
      );
    }

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

    queryBuilder.andWhere("parent.chainId = :chainId", {
      chainId: userEntity.chainId,
    });
    queryBuilder.andWhere("child.chainId = :chainId", {
      chainId: userEntity.chainId,
    });

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
