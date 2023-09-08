import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import type { IVestingSearchDto } from "@framework/types";
import { ModuleType } from "@framework/types";

import { MerchantEntity } from "../../../infrastructure/merchant/merchant.entity";
import { ContractEntity } from "../../hierarchy/contract/contract.entity";

@Injectable()
export class VestingService {
  constructor(
    @InjectRepository(ContractEntity)
    private readonly contractEntityRepository: Repository<ContractEntity>,
  ) {}

  public findOne(
    where: FindOptionsWhere<ContractEntity>,
    options?: FindOneOptions<ContractEntity>,
  ): Promise<ContractEntity | null> {
    return this.contractEntityRepository.findOne({ where, ...options });
  }

  public async search(
    dto: Partial<IVestingSearchDto>,
    merchantEntity: MerchantEntity,
  ): Promise<[Array<ContractEntity>, number]> {
    const { account, skip, take } = dto;

    const queryBuilder = this.contractEntityRepository.createQueryBuilder("vesting");

    queryBuilder.select();
    queryBuilder.andWhere("vesting.contractModule = :contractModule", {
      contractModule: ModuleType.VESTING,
    });

    queryBuilder.andWhere(`vesting.parameters->>'account' = :account`, {
      account,
    });

    queryBuilder.andWhere("vesting.merchantId = :merchantId", {
      merchantId: merchantEntity.id,
    });

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    queryBuilder.orderBy({
      "vesting.createdAt": "DESC",
    });

    return queryBuilder.getManyAndCount();
  }
}
