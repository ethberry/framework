import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindOneOptions, FindOptionsWhere, In, Repository } from "typeorm";

import { UniContractStatus, IErc1155ContractAutocompleteDto, IErc1155ContractSearchDto } from "@framework/types";

import { IUniContractUpdateDto } from "./interfaces";
import { UniContractEntity } from "../../blockchain/uni-token/uni-contract/uni-contract.entity";

@Injectable()
export class Erc1155ContractService {
  constructor(
    @InjectRepository(UniContractEntity)
    private readonly erc1155CollectionEntityRepository: Repository<UniContractEntity>,
  ) {}

  public search(dto: IErc1155ContractSearchDto): Promise<[Array<UniContractEntity>, number]> {
    const { query, contractStatus, skip, take } = dto;

    const queryBuilder = this.erc1155CollectionEntityRepository.createQueryBuilder("collection");

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

    if (contractStatus) {
      if (contractStatus.length === 1) {
        queryBuilder.andWhere("contract.contractStatus = :contractStatus", {
          contractStatus: contractStatus[0],
        });
      } else {
        queryBuilder.andWhere("contract.contractStatus IN(:...contractStatus)", { contractStatus });
      }
    }

    queryBuilder.orderBy("contract.createdAt", "DESC");

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    return queryBuilder.getManyAndCount();
  }

  public async autocomplete(dto: IErc1155ContractAutocompleteDto): Promise<Array<UniContractEntity>> {
    const { contractStatus = [] } = dto;

    const where = {};

    if (contractStatus.length) {
      Object.assign(where, {
        contractStatus: In(contractStatus),
      });
    }

    return this.erc1155CollectionEntityRepository.find({
      where,
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
    return this.erc1155CollectionEntityRepository.findOne({ where, ...options });
  }

  public async update(
    where: FindOptionsWhere<UniContractEntity>,
    dto: Partial<IUniContractUpdateDto>,
  ): Promise<UniContractEntity> {
    const collectionEntity = await this.erc1155CollectionEntityRepository.findOne({ where });

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
