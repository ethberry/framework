import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { ISearchDto } from "@gemunion/types-collection";
import { ContractRole } from "@framework/types";

import { ContractEntity } from "../../blockchain/hierarchy/contract/contract.entity";

@Injectable()
export class Erc998CollectionService {
  constructor(
    @InjectRepository(ContractEntity)
    private readonly erc998CollectionEntityRepository: Repository<ContractEntity>,
  ) {}

  public search(dto: ISearchDto): Promise<[Array<ContractEntity>, number]> {
    const { query, skip, take } = dto;

    const queryBuilder = this.erc998CollectionEntityRepository.createQueryBuilder("collection");

    queryBuilder.select();

    if (query) {
      queryBuilder.leftJoin(
        "(SELECT 1)",
        "dummy",
        "TRUE LEFT JOIN LATERAL json_array_elements(contract.description->'blocks') blocks ON TRUE",
      );
      queryBuilder.andWhere(
        new Brackets(qb => {
          qb.where("contract.title ILIKE '%' || :title || '%'", { title: query });
          qb.orWhere("blocks->>'text' ILIKE '%' || :description || '%'", { description: query });
        }),
      );
    }

    queryBuilder.andWhere("contract.collectionType IN(:...collectionTypes)", {
      collectionTypes: [ContractRole.TOKEN, ContractRole.DROPBOX],
    });

    queryBuilder.orderBy("contract.createdAt", "DESC");

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    return queryBuilder.getManyAndCount();
  }

  public async autocomplete(): Promise<Array<ContractEntity>> {
    return this.erc998CollectionEntityRepository.find({
      select: {
        id: true,
        title: true,
      },
    });
  }

  public findOne(
    where: FindOptionsWhere<ContractEntity>,
    options?: FindOneOptions<ContractEntity>,
  ): Promise<ContractEntity | null> {
    return this.erc998CollectionEntityRepository.findOne({ where, ...options });
  }
}
