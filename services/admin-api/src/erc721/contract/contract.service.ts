import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindOneOptions, FindOptionsWhere, In, Repository } from "typeorm";

import {
  UniContractStatus,
  IErc721ContractAutocompleteDto,
  IErc721ContractSearchDto,
  TokenType,
} from "@framework/types";

import { IErc721CollectionUpdateDto } from "./interfaces";
import { UniContractEntity } from "../../blockchain/uni-token/uni-contract.entity";

@Injectable()
export class Erc721ContractService {
  constructor(
    @InjectRepository(UniContractEntity)
    private readonly uniContractEntityRepository: Repository<UniContractEntity>,
  ) {}

  public search(dto: IErc721ContractSearchDto): Promise<[Array<UniContractEntity>, number]> {
    const { query, contractStatus, contractRole, skip, take } = dto;

    const queryBuilder = this.uniContractEntityRepository.createQueryBuilder("contract");

    queryBuilder.select();

    queryBuilder.andWhere("contract.contractType = :contractType", { contractType: TokenType.ERC721 });

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

    if (contractRole) {
      if (contractRole.length === 1) {
        queryBuilder.andWhere("contract.contractRole = :contractRole", {
          contractRole: contractRole[0],
        });
      } else {
        queryBuilder.andWhere("contract.contractRole IN(:...contractRole)", { contractRole });
      }
    }

    queryBuilder.orderBy("contract.createdAt", "DESC");

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    return queryBuilder.getManyAndCount();
  }

  public async autocomplete(dto: IErc721ContractAutocompleteDto): Promise<Array<UniContractEntity>> {
    const { contractRole = [], contractStatus = [] } = dto;

    const where = {};

    if (contractRole.length) {
      Object.assign(where, {
        collectionType: In(contractRole),
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
    dto: Partial<IErc721CollectionUpdateDto>,
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
