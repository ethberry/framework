import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ArrayOverlap, Brackets, FindOneOptions, FindOptionsWhere, In, Not, Repository } from "typeorm";

import type { IContractAutocompleteDto, IContractSearchDto } from "@framework/types";
import { ContractStatus, TokenType } from "@framework/types";

import { ContractEntity } from "./contract.entity";
import { TemplateEntity } from "../template/template.entity";
import { IContractUpdateDto } from "./interfaces";
import { UserEntity } from "../../../infrastructure/user/user.entity";

@Injectable()
export class ContractService {
  constructor(
    @InjectRepository(ContractEntity)
    protected readonly contractEntityRepository: Repository<ContractEntity>,
  ) {}

  public async search(dto: IContractSearchDto, userEntity: UserEntity): Promise<[Array<ContractEntity>, number]> {
    const { query, contractStatus, contractFeatures, contractType, contractModule, skip, take } = dto;

    const queryBuilder = this.contractEntityRepository.createQueryBuilder("contract");

    queryBuilder.select();

    // get single template for ERC20, to display token cap
    queryBuilder.leftJoin("contract.templates", "templates", "contract.contractType = :tokenType", {
      tokenType: TokenType.ERC20,
    });
    queryBuilder.addSelect(["templates.id", "templates.amount"]);

    queryBuilder.andWhere("contract.merchantId = :merchantId", {
      merchantId: userEntity.merchantId,
    });

    queryBuilder.andWhere("contract.chainId = :chainId", {
      chainId: userEntity.chainId,
    });

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

    if (contractStatus) {
      if (contractStatus.length === 1) {
        queryBuilder.andWhere("contract.contractStatus = :contractStatus", { contractStatus: contractStatus[0] });
      } else {
        queryBuilder.andWhere("contract.contractStatus IN(:...contractStatus)", { contractStatus });
      }
    }

    if (contractFeatures) {
      if (contractFeatures.length === 1) {
        queryBuilder.andWhere(":contractFeature = ANY(contract.contractFeatures)", {
          contractFeature: contractFeatures[0],
        });
      } else {
        queryBuilder.andWhere("contract.contractFeatures && :contractFeatures", { contractFeatures });
      }
    }

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
      "contract.id": "ASC",
    });

    return queryBuilder.getManyAndCount();
  }

  public async autocomplete(
    dto: Partial<IContractAutocompleteDto>,
    userEntity: UserEntity,
  ): Promise<Array<ContractEntity>> {
    const {
      contractStatus = [],
      contractFeatures = [],
      contractType = [],
      contractModule = [],
      excludeFeatures = [],
    } = dto;
    const where = {
      chainId: userEntity.chainId,
      merchantId: userEntity.merchantId,
    };

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

    if (contractFeatures.length) {
      Object.assign(where, {
        // https://github.com/typeorm/typeorm/blob/master/docs/find-options.md
        contractFeatures: ArrayOverlap(contractFeatures),
      });
    }

    // this is used only to filter out SOULBOUND from transfer action menu
    if (excludeFeatures.length) {
      Object.assign(where, {
        // https://github.com/typeorm/typeorm/blob/master/docs/find-options.md
        contractFeatures: Not(ArrayOverlap(excludeFeatures)),
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

  public findAll(
    where: FindOptionsWhere<ContractEntity>,
    options?: FindOneOptions<ContractEntity>,
  ): Promise<Array<ContractEntity>> {
    return this.contractEntityRepository.find({ where, ...options });
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

  public delete(where: FindOptionsWhere<TemplateEntity>): Promise<ContractEntity> {
    return this.update(where, { contractStatus: ContractStatus.INACTIVE });
  }
}
