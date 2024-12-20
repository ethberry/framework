import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  ArrayOverlap,
  Brackets,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  In,
  Not,
  Repository,
  UpdateResult,
} from "typeorm";

import type { IContractSearchDto } from "@framework/types";
import { ContractFeatures, ContractStatus, ModuleType, TokenType } from "@framework/types";

import { UserEntity } from "../../../infrastructure/user/user.entity";
import { ContractEntity } from "./contract.entity";
import type { IContractUpdateDto, IContractAutocompleteExtDto } from "./interfaces";

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
    const { query, contractStatus, contractFeatures, skip, take } = dto;

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
        "blocks",
        "TRUE",
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

  public async autocomplete(
    dto: Partial<IContractAutocompleteExtDto>,
    userEntity: UserEntity,
  ): Promise<Array<ContractEntity>> {
    const {
      contractStatus = [],
      contractFeatures = [],
      contractType = [],
      contractModule = [],
      excludeFeatures = [],
      includeExternalContracts,
      contractId,
    } = dto;

    const where = {
      chainId: userEntity.chainId,
      merchantId: userEntity.merchantId,
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

    // so far this is used only to filter out SOULBOUND tokens
    // and to filter out EXTERNAL contracts for achievements
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

    const contractEntities = await this.contractEntityRepository.find({
      where,
      select: {
        id: true,
        title: true,
        address: true,
        contractType: true,
        contractFeatures: true,
        contractModule: true,
        decimals: true,
        symbol: true,
      },
    });

    if (includeExternalContracts && userEntity.merchantId !== 1) {
      const externalContractEntities = await this.autocomplete(
        {
          contractStatus,
          contractFeatures: [ContractFeatures.EXTERNAL],
          contractType,
          contractModule,
          excludeFeatures,
        },
        {
          chainId: userEntity.chainId,
          merchantId: 1,
        } as UserEntity,
      );
      return contractEntities.concat(externalContractEntities);
    }

    return contractEntities;
  }

  public findOne(
    where: FindOptionsWhere<ContractEntity>,
    options?: FindOneOptions<ContractEntity>,
  ): Promise<ContractEntity | null> {
    return this.contractEntityRepository.findOne({ where, ...options });
  }

  public findAll(
    where: FindOptionsWhere<ContractEntity>,
    options?: FindManyOptions<ContractEntity>,
  ): Promise<Array<ContractEntity>> {
    return this.contractEntityRepository.find({ where, ...options });
  }

  public async update(
    where: FindOptionsWhere<ContractEntity>,
    dto: Partial<IContractUpdateDto>,
    userEntity: UserEntity,
  ): Promise<ContractEntity> {
    const contractEntity = await this.findOne(where);

    if (!contractEntity) {
      throw new NotFoundException("contractNotFound");
    }

    if (contractEntity.merchantId !== userEntity.merchantId) {
      throw new ForbiddenException("insufficientPermissions");
    }

    Object.assign(contractEntity, dto);

    // UPDATE ERC20\NATIVE TEMPLATES AS WELL
    if (contractEntity.contractType === TokenType.NATIVE || contractEntity.contractType === TokenType.ERC20) {
      const contractEntitywithTemplate = await this.findOne(
        { id: contractEntity.id },
        { relations: { templates: true } },
      );
      if (!contractEntitywithTemplate) {
        throw new NotFoundException("contractNotFound");
      }
      const template = contractEntitywithTemplate.templates[0];

      if (dto.title) {
        await Object.assign(template, { title: dto.title }).save();
      }
      if (dto.description) {
        await Object.assign(template, { description: dto.description }).save();
      }
      if (dto.imageUrl) {
        await Object.assign(template, { description: dto.description }).save();
      }
    }

    return contractEntity.save();
  }

  public delete(where: FindOptionsWhere<ContractEntity>, userEntity: UserEntity): Promise<ContractEntity> {
    return this.update(where, { contractStatus: ContractStatus.INACTIVE }, userEntity);
  }

  public count(where: FindOptionsWhere<ContractEntity>): Promise<number> {
    return this.contractEntityRepository.count({ where });
  }

  public async findOneOrFail(where: FindOptionsWhere<ContractEntity>): Promise<ContractEntity> {
    const contractEntity = await this.findOne(where);

    // system must exist
    if (!contractEntity) {
      throw new NotFoundException("contractNotFound");
    }

    return contractEntity;
  }

  public async updateParameter(
    where: FindOptionsWhere<UserEntity>,
    key: string,
    value: string | number,
  ): Promise<UpdateResult> {
    const queryBuilder = this.contractEntityRepository.createQueryBuilder("contract").update();
    queryBuilder.set({
      parameters: () => `jsonb_set(parameters::jsonb, '{${key}}', '"${value}"', true)`,
    });
    queryBuilder.where(where);
    return queryBuilder.execute();
  }
}
