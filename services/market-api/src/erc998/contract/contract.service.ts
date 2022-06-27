import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { ISearchDto } from "@gemunion/types-collection";
import { UniContractType } from "@framework/types";

import { UniContractEntity } from "../../uni-token/uni-contract.entity";

@Injectable()
export class Erc998CollectionService {
  constructor(
    @InjectRepository(UniContractEntity)
    private readonly erc998CollectionEntityRepository: Repository<UniContractEntity>,
  ) {}

  public search(dto: ISearchDto): Promise<[Array<UniContractEntity>, number]> {
    const { query, skip, take } = dto;

    const queryBuilder = this.erc998CollectionEntityRepository.createQueryBuilder("collection");

    queryBuilder.select();

    if (query) {
      queryBuilder.leftJoin(
        "(SELECT 1)",
        "dummy",
        "TRUE LEFT JOIN LATERAL json_array_elements(collection.description->'blocks') blocks ON TRUE",
      );
      queryBuilder.andWhere(
        new Brackets(qb => {
          qb.where("collection.title ILIKE '%' || :title || '%'", { title: query });
          qb.orWhere("blocks->>'text' ILIKE '%' || :description || '%'", { description: query });
        }),
      );
    }

    queryBuilder.andWhere("collection.collectionType IN(:...collectionTypes)", {
      collectionTypes: [UniContractType.TOKEN, UniContractType.DROPBOX],
    });

    queryBuilder.orderBy("collection.createdAt", "DESC");

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    return queryBuilder.getManyAndCount();
  }

  public async autocomplete(): Promise<Array<UniContractEntity>> {
    return this.erc998CollectionEntityRepository.find({
      select: {
        id: true,
        title: true,
      },
    });
  }

  public findOne(
    where: FindOptionsWhere<UniContractEntity>,
    options?: FindOneOptions<UniContractEntity>,
  ): Promise<UniContractEntity | null> {
    return this.erc998CollectionEntityRepository.findOne({ where, ...options });
  }
}
