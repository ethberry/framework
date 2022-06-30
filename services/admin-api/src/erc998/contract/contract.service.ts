import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindOneOptions, FindOptionsWhere, In, Repository } from "typeorm";

import {
  IErc998CollectionAutocompleteDto,
  IErc998ContractSearchDto,
  TokenType,
  UniContractStatus,
} from "@framework/types";

import { IErc998CollectionUpdateDto } from "./interfaces";
import { UniContractEntity } from "../../blockchain/uni-token/uni-contract/uni-contract.entity";

@Injectable()
export class Erc998ContractService {
  constructor(
    @InjectRepository(UniContractEntity)
    private readonly uniContractEntityRepository: Repository<UniContractEntity>,
  ) {}

  public search(dto: IErc998ContractSearchDto): Promise<[Array<UniContractEntity>, number]> {
    const { query, contractStatus, contractRole, skip, take } = dto;

    const queryBuilder = this.uniContractEntityRepository.createQueryBuilder("contract");

    queryBuilder.select();

    queryBuilder.andWhere("contract.contractType = :contractType", { contractType: TokenType.ERC998 });

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

  public async autocomplete(dto: IErc998CollectionAutocompleteDto): Promise<Array<UniContractEntity>> {
    const { contractRole = [], contractStatus = [] } = dto;

    const where = {
      contractType: TokenType.ERC998,
    };

    if (contractRole.length) {
      Object.assign(where, {
        contractRole: In(contractRole),
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
    const contractEntity = await this.uniContractEntityRepository.findOne({ where });

    if (!contractEntity) {
      throw new NotFoundException("contractNotFound");
    }

    Object.assign(contractEntity, dto);

    return contractEntity.save();
  }

  public async delete(where: FindOptionsWhere<UniContractEntity>): Promise<UniContractEntity> {
    return this.update(where, {
      contractStatus: UniContractStatus.INACTIVE,
    });
  }
}
