import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindOneOptions, FindOptionsWhere, In, Repository } from "typeorm";

import { ISearchDto } from "@gemunion/types-collection";
import { ContractStatus, IContractAutocompleteDto, ModuleType, TokenType } from "@framework/types";

import { ContractEntity } from "./contract.entity";
import { TemplateEntity } from "../template/template.entity";
import { IContractUpdateDto } from "./interfaces";

@Injectable()
export class ContractService {
  constructor(
    @InjectRepository(ContractEntity)
    protected readonly contractEntityRepository: Repository<ContractEntity>,
  ) {}

  public async search(dto: ISearchDto, contractType: TokenType): Promise<[Array<ContractEntity>, number]> {
    const { query, skip, take } = dto;

    const queryBuilder = this.contractEntityRepository.createQueryBuilder("contract");

    queryBuilder.select();

    queryBuilder.andWhere("contract.contractType = :contractType", { contractType });

    // MODULE:LOOTBOX
    queryBuilder.andWhere("contract.contractModule != :contractModule", {
      contractModule: ModuleType.LOOTBOX,
    });

    queryBuilder.andWhere("contract.contractStatus = :contractStatus", { contractStatus: ContractStatus.ACTIVE });

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

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    queryBuilder.orderBy({
      "contract.createdAt": "DESC",
    });

    return queryBuilder.getManyAndCount();
  }

  public async autocomplete(dto: IContractAutocompleteDto): Promise<Array<ContractEntity>> {
    const { contractStatus = [], contractTemplate = [], contractType = [] } = dto;

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
    dto: Partial<IContractUpdateDto>,
  ): Promise<ContractEntity> {
    const contractEntity = await this.findOne(where);

    if (!contractEntity) {
      throw new NotFoundException("contractNotFound");
    }

    Object.assign(contractEntity, dto);

    return contractEntity.save();
  }

  public async delete(where: FindOptionsWhere<TemplateEntity>): Promise<ContractEntity> {
    return this.update(where, { contractStatus: ContractStatus.INACTIVE });
  }
}
