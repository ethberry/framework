import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { UniContractStatus } from "@framework/types";
import { ISearchDto } from "@gemunion/types-collection";
import { UniContractEntity } from "../../uni-token/uni-contract.entity";

@Injectable()
export class Erc1155ContractService {
  constructor(
    @InjectRepository(UniContractEntity)
    private readonly uniContractEntityRepository: Repository<UniContractEntity>,
  ) {}

  public search(dto: ISearchDto): Promise<[Array<UniContractEntity>, number]> {
    const { query, skip, take } = dto;

    const queryBuilder = this.uniContractEntityRepository.createQueryBuilder("collection");

    queryBuilder.select();

    if (query) {
      queryBuilder.andWhere(
        new Brackets(qb => {
          qb.where("collection.title ILIKE '%' || :title || '%'", { title: query });
          qb.orWhere("collection.description ILIKE '%' || :description || '%'", { description: query });
        }),
      );
    }

    queryBuilder.andWhere("collection.contractStatus = :contractStatus", {
      contractStatus: UniContractStatus.ACTIVE,
    });

    queryBuilder.orderBy("collection.createdAt", "DESC");

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    return queryBuilder.getManyAndCount();
  }

  public async autocomplete(): Promise<Array<UniContractEntity>> {
    return this.uniContractEntityRepository.find({
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
    return this.uniContractEntityRepository.findOne({ where, ...options });
  }
}
