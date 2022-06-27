import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindOneOptions, FindOptionsWhere, In, Repository } from "typeorm";

import { UniContractStatus, IErc998CollectionAutocompleteDto, IErc998CollectionSearchDto } from "@framework/types";

import { IErc998CollectionUpdateDto } from "./interfaces";
import { UniContractEntity } from "../../uni-token/uni-contract.entity";

@Injectable()
export class Erc998CollectionService {
  constructor(
    @InjectRepository(UniContractEntity)
    private readonly uniContractEntityRepository: Repository<UniContractEntity>,
  ) {}

  public search(dto: IErc998CollectionSearchDto): Promise<[Array<UniContractEntity>, number]> {
    const { query, contractStatus, contractType, skip, take } = dto;

    const queryBuilder = this.uniContractEntityRepository.createQueryBuilder("collection");

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

    if (contractStatus) {
      if (contractStatus.length === 1) {
        queryBuilder.andWhere("collection.contractStatus = :contractStatus", {
          contractStatus: contractStatus[0],
        });
      } else {
        queryBuilder.andWhere("collection.contractStatus IN(:...contractStatus)", { contractStatus });
      }
    }

    if (contractType) {
      if (contractType.length === 1) {
        queryBuilder.andWhere("collection.contractType = :contractType", {
          contractType: contractType[0],
        });
      } else {
        queryBuilder.andWhere("collection.contractType IN(:...contractType)", { contractType });
      }
    }

    queryBuilder.orderBy("collection.createdAt", "DESC");

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    return queryBuilder.getManyAndCount();
  }

  public async autocomplete(dto: IErc998CollectionAutocompleteDto): Promise<Array<UniContractEntity>> {
    const { contractType = [], contractStatus = [] } = dto;

    const where = {};

    if (contractType.length) {
      Object.assign(where, {
        contractType: In(contractType),
      });
    }

    if (contractStatus.length) {
      Object.assign(where, {
        contractStatus: In(contractStatus),
      });
    }

    return this.uniContractEntityRepository.find({
      where,
      select: {
        id: true,
        title: true,
        contractType: true,
      },
    });
  }

  public findOne(
    where: FindOptionsWhere<UniContractEntity>,
    options?: FindOneOptions<UniContractEntity>,
  ): Promise<UniContractEntity | null> {
    return this.uniContractEntityRepository.findOne({ where, ...options });
  }

  public async update(
    where: FindOptionsWhere<UniContractEntity>,
    dto: Partial<IErc998CollectionUpdateDto>,
  ): Promise<UniContractEntity> {
    const collectionEntity = await this.uniContractEntityRepository.findOne({ where });

    if (!collectionEntity) {
      throw new NotFoundException("collectionNotFound");
    }

    Object.assign(collectionEntity, dto);

    return collectionEntity.save();
  }

  public async delete(where: FindOptionsWhere<UniContractEntity>): Promise<UniContractEntity> {
    return this.update(where, {
      contractStatus: UniContractStatus.INACTIVE,
    });
  }
}
