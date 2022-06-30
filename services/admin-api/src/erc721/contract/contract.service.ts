import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindOneOptions, FindOptionsWhere, In, Repository } from "typeorm";

import { IErc721ContractAutocompleteDto, IErc721ContractSearchDto, TokenType, ContractStatus } from "@framework/types";

import { IErc721CollectionUpdateDto } from "./interfaces";
import { ContractEntity } from "../../blockchain/hierarchy/contract/contract.entity";

@Injectable()
export class Erc721ContractService {
  constructor(
    @InjectRepository(ContractEntity)
    private readonly contractEntityRepository: Repository<ContractEntity>,
  ) {}

  public search(dto: IErc721ContractSearchDto): Promise<[Array<ContractEntity>, number]> {
    const { query, contractStatus, contractRole, skip, take } = dto;

    const queryBuilder = this.contractEntityRepository.createQueryBuilder("contract");

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

  public async autocomplete(dto: IErc721ContractAutocompleteDto): Promise<Array<ContractEntity>> {
    const { contractRole = [], contractStatus = [] } = dto;

    const where = {
      contractType: TokenType.ERC721,
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

    return this.contractEntityRepository.find({
      where,
      select: {
        id: true,
        title: true,
        contractType: true,
      },
    });
  }

  public findOne(
    where: FindOptionsWhere<ContractEntity>,
    options?: FindOneOptions<ContractEntity>,
  ): Promise<ContractEntity | null> {
    return this.contractEntityRepository.findOne({ where, ...options });
  }

  public async update(
    where: FindOptionsWhere<ContractEntity>,
    dto: Partial<IErc721CollectionUpdateDto>,
  ): Promise<ContractEntity> {
    const contractEntity = await this.contractEntityRepository.findOne({ where });

    if (!contractEntity) {
      throw new NotFoundException("contractNotFound");
    }

    Object.assign(contractEntity, dto);

    return contractEntity.save();
  }

  public async delete(where: FindOptionsWhere<ContractEntity>): Promise<ContractEntity> {
    return this.update(where, {
      contractStatus: ContractStatus.INACTIVE,
    });
  }
}
