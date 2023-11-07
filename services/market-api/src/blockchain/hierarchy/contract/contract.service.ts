import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ArrayOverlap, Brackets, FindOneOptions, FindOptionsWhere, In, Not, Repository } from "typeorm";
import type { IContractSearchDto } from "@framework/types";
import { ContractFeatures, ContractStatus, ModuleType, TokenType } from "@framework/types";

import { UserEntity } from "../../../infrastructure/user/user.entity";
import { ContractEntity } from "./contract.entity";
import { IContractAutocompleteExtDto } from "./interface";

@Injectable()
export class ContractService {
  constructor(
    @InjectRepository(ContractEntity)
    protected readonly contractEntityRepository: Repository<ContractEntity>,
  ) {}

  public async search(
    dto: Partial<IContractSearchDto>,
    userEntity: UserEntity,
    contractModule: Array<ModuleType>,
    contractType: Array<TokenType> | null,
  ): Promise<[Array<ContractEntity>, number]> {
    const { query, skip, take, merchantId } = dto;

    const queryBuilder = this.contractEntityRepository.createQueryBuilder("contract");

    // get merchant wallet
    queryBuilder.leftJoin("contract.merchant", "merchant");
    queryBuilder.addSelect(["merchant.id", "merchant.wallet"]);

    if (merchantId) {
      queryBuilder.andWhere("contract.merchantId = :merchantId", {
        merchantId,
      });
    }

    const modules = [ModuleType.HIERARCHY, ModuleType.COLLECTION, ModuleType.MYSTERY];
    if (contractModule && contractModule.filter(value => modules.includes(value)).length > 0) {
      // filter out contract without templates
      queryBuilder.andWhereExists(
        // https://github.com/typeorm/typeorm/issues/2815
        this.contractEntityRepository
          .createQueryBuilder("c")
          .select()
          .innerJoinAndSelect("c.templates", "template", "template.id IS NOT NULL")
          .where("c.id = contract.id"),
      );
    }
    queryBuilder.select();

    if (contractType) {
      if (contractType.length === 1) {
        queryBuilder.andWhere("contract.contractType = :contractType", { contractType: contractType[0] });
      } else {
        queryBuilder.andWhere("contract.contractType IN(:...contractType)", { contractType });
      }
    } else if (contractType === null) {
      queryBuilder.andWhere("contract.contractType IS NULL");
    }

    if (contractModule) {
      if (contractModule.length === 1) {
        queryBuilder.andWhere("contract.contractModule = :contractModule", { contractModule: contractModule[0] });
      } else {
        queryBuilder.andWhere("contract.contractModule IN(:...contractModule)", { contractModule });
      }
    }

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
      "contract.id": "DESC",
    });

    return queryBuilder.getManyAndCount();
  }

  public async autocomplete(dto: IContractAutocompleteExtDto, userEntity: UserEntity): Promise<Array<ContractEntity>> {
    const {
      contractId,
      merchantId,
      contractFeatures = [],
      contractType = [],
      contractModule = [],
      excludeFeatures = [],
    } = dto;

    const where = {
      chainId: userEntity.chainId,
      contractStatus: ContractStatus.ACTIVE,
    };

    if (contractId) {
      Object.assign(where, {
        id: contractId,
      });
    }

    if (merchantId) {
      Object.assign(where, {
        merchantId,
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

    // so far this is used only to filter out SOULBOUND tokens
    if (excludeFeatures.length) {
      Object.assign(where, {
        // https://github.com/typeorm/typeorm/blob/master/docs/find-options.md
        contractFeatures: Not(ArrayOverlap(excludeFeatures)),
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
        symbol: true,
      },
    });
  }

  public findOne(
    where: FindOptionsWhere<ContractEntity>,
    options?: FindOneOptions<ContractEntity>,
  ): Promise<ContractEntity | null> {
    return this.contractEntityRepository.findOne({ where, ...options });
  }

  public async findOneOrFail(where: FindOptionsWhere<ContractEntity>): Promise<ContractEntity> {
    const contractEntity = await this.findOne(where);

    // system must exist
    if (!contractEntity) {
      throw new NotFoundException("contractNotFound");
    }

    return contractEntity;
  }
}
