import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { ArrayOverlap, Brackets, FindOneOptions, FindOptionsWhere, In, Repository } from "typeorm";
import {
  ContractFeatures,
  ContractStatus,
  IContractAutocompleteDto,
  IContractSearchDto,
  ModuleType,
  TokenType,
} from "@framework/types";

import { ContractEntity } from "./contract.entity";
import { MerchantEntity } from "../../../infrastructure/merchant/merchant.entity";

@Injectable()
export class ContractService {
  constructor(
    @InjectRepository(ContractEntity)
    protected readonly contractEntityRepository: Repository<ContractEntity>,
    protected readonly configService: ConfigService,
  ) {}

  public async search(
    dto: IContractSearchDto,
    merchantEntity: MerchantEntity,
    contractModule: Array<ModuleType>,
    contractType: Array<TokenType> | null,
  ): Promise<[Array<ContractEntity>, number]> {
    const { query, skip, take, chainId } = dto;

    const queryBuilder = this.contractEntityRepository.createQueryBuilder("contract");

    queryBuilder.select();

    queryBuilder.andWhere("contract.merchantId = :merchantId", {
      merchantId: merchantEntity.id,
    });

    queryBuilder.andWhere("contract.chainId = :chainId", {
      chainId,
    });

    // get merchant wallet
    queryBuilder.leftJoin("contract.merchant", "merchant");
    queryBuilder.addSelect(["merchant.id", "merchant.wallet"]);

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

  public async autocomplete(
    dto: IContractAutocompleteDto,
    merchantEntity: MerchantEntity,
  ): Promise<Array<ContractEntity>> {
    const { contractFeatures = [], contractType = [], contractModule = [], chainId } = dto;

    const where = {
      chainId,
      merchantId: merchantEntity.id,
      contractStatus: ContractStatus.ACTIVE,
    };

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

  public async findOneWithRelations(
    where: FindOptionsWhere<ContractEntity>,
    merchantEntity: MerchantEntity,
  ): Promise<ContractEntity | null> {
    const contractEntity = await this.findOne(where);

    if (!contractEntity) {
      throw new NotFoundException("contractNotFound");
    }

    if (contractEntity.merchantId !== merchantEntity.id) {
      throw new ForbiddenException("insufficientPermissions");
    }

    return contractEntity;
  }
}
