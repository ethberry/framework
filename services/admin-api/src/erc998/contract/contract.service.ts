import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, Repository } from "typeorm";

import { IErc998ContractSearchDto, TokenType } from "@framework/types";

import { ContractEntity } from "../../blockchain/hierarchy/contract/contract.entity";
import { ContractService } from "../../blockchain/hierarchy/contract/contract.service";

@Injectable()
export class Erc998ContractService extends ContractService {
  constructor(
    @InjectRepository(ContractEntity)
    protected readonly contractEntityRepository: Repository<ContractEntity>,
  ) {
    super(contractEntityRepository);
  }

  public search(dto: IErc998ContractSearchDto): Promise<[Array<ContractEntity>, number]> {
    const { query, contractStatus, contractRole, skip, take } = dto;

    const queryBuilder = this.contractEntityRepository.createQueryBuilder("contract");

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
}
