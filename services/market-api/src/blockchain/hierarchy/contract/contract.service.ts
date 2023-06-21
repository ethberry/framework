import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ArrayOverlap, Brackets, FindOneOptions, FindOptionsWhere, In, Repository } from "typeorm";

import type { ISearchDto } from "@gemunion/types-collection";
import { ContractFeatures, ContractStatus, IContractAutocompleteDto, ModuleType, TokenType } from "@framework/types";

import { ContractEntity } from "./contract.entity";
import { UserEntity } from "../../../infrastructure/user/user.entity";

@Injectable()
export class ContractService {
  constructor(
    @InjectRepository(ContractEntity)
    protected readonly contractEntityRepository: Repository<ContractEntity>,
  ) {}

  public async search(
    dto: ISearchDto,
    userEntity: UserEntity,
    contractType: TokenType,
    contractModule: ModuleType,
  ): Promise<[Array<ContractEntity>, number]> {
    const { query, skip, take } = dto;

    const queryBuilder = this.contractEntityRepository.createQueryBuilder("contract");

    // filter out contract without templates
    queryBuilder.andWhereExists(
      // https://github.com/typeorm/typeorm/issues/2815
      this.contractEntityRepository
        .createQueryBuilder("c")
        .select()
        .innerJoinAndSelect("c.templates", "template", "template.id IS NOT NULL")
        .where("c.id = contract.id"),
    );

    queryBuilder.select();

    queryBuilder.andWhere("contract.contractType = :contractType", {
      contractType,
    });
    queryBuilder.andWhere("contract.contractModule = :contractModule", {
      contractModule,
    });

    // do not display external contracts as there is no way to mint tokens from it
    queryBuilder.andWhere("NOT(:contractFeature = ANY(contract.contractFeatures))", {
      contractFeature: ContractFeatures.EXTERNAL,
    });

    queryBuilder.andWhere("contract.contractStatus = :contractStatus", {
      contractStatus: ContractStatus.ACTIVE,
    });
    queryBuilder.andWhere("contract.chainId = :chainId", {
      chainId: userEntity.chainId,
    });
    queryBuilder.andWhere("contract.isPaused = :isPaused", {
      isPaused: false,
    });

    if (query) {
      queryBuilder.leftJoin(
        qb => {
          qb.getQuery = () => `LATERAL json_array_elements(contract.description->'blocks')`;
          return qb;
        },
        `blocks`,
        `TRUE`,
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

  public async autocomplete(dto: IContractAutocompleteDto, chainId: number): Promise<Array<ContractEntity>> {
    const { contractFeatures = [], contractType = [], contractModule = [], contractId } = dto;

    const where = {
      chainId,
      contractStatus: ContractStatus.ACTIVE,
    };

    if (contractId) {
      Object.assign(where, {
        id: contractId,
      });
    }

    if (contractType.length) {
      Object.assign(where, {
        contractType: In(contractType),
      });
    }

    if (contractFeatures.length) {
      Object.assign(where, {
        // https://github.com/typeorm/typeorm/blob/master/docs/find-options.md
        contractFeatures: ArrayOverlap(contractFeatures),
      });
    }

    if (contractModule.length) {
      Object.assign(where, {
        contractModule: In(contractModule),
      });
    }

    return this.contractEntityRepository.find({
      where,
      select: {
        id: true,
        title: true,
        address: true,
        contractType: true,
        decimals: true,
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
