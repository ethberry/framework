import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindOneOptions, FindOptionsWhere, In, Repository } from "typeorm";

import { ISearchDto } from "@gemunion/types-collection";
import { ContractRole, ContractStatus, IContractAutocompleteDto, TokenType } from "@framework/types";

import { ContractEntity } from "./contract.entity";

@Injectable()
export class ContractService {
  constructor(
    @InjectRepository(ContractEntity)
    protected readonly contractEntityRepository: Repository<ContractEntity>,
  ) {}

  public search(dto: ISearchDto, contractType: TokenType): Promise<[Array<ContractEntity>, number]> {
    const { query, skip, take } = dto;

    const queryBuilder = this.contractEntityRepository.createQueryBuilder("contract");

    queryBuilder.andWhere("contract.contractType = :contractType", { contractType });

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

    queryBuilder.andWhere("contract.contractRole IN(:...contractRoles)", {
      contractRoles: [ContractRole.TOKEN, ContractRole.DROPBOX],
    });

    queryBuilder.orderBy("contract.createdAt", "DESC");

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    return queryBuilder.getManyAndCount();
  }

  public async autocomplete(dto: IContractAutocompleteDto): Promise<Array<ContractEntity>> {
    const { contractTemplate = [] } = dto;

    const where = {
      contractStatus: ContractStatus.ACTIVE,
    };

    if (contractTemplate.length) {
      Object.assign(where, {
        contractTemplate: In(contractTemplate),
      });
    }

    return this.contractEntityRepository.find({
      where,
      select: {
        id: true,
        title: true,
        contractTemplate: true,
      },
    });
  }

  public findOne(
    where: FindOptionsWhere<ContractEntity>,
    options?: FindOneOptions<ContractEntity>,
  ): Promise<ContractEntity | null> {
    return this.contractEntityRepository.findOne({ where, ...options });
  }
}
