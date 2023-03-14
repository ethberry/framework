import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import type { IVestingSearchDto } from "@framework/types";
import { ModuleType } from "@framework/types";
import { ContractEntity } from "../../hierarchy/contract/contract.entity";

@Injectable()
export class VestingService {
  constructor(
    @InjectRepository(ContractEntity)
    private readonly contractEntityRepository: Repository<ContractEntity>,
  ) {}

  public async search(dto: IVestingSearchDto): Promise<[Array<ContractEntity>, number]> {
    const { account, contractTemplate, skip, take } = dto;

    const queryBuilder = this.contractEntityRepository.createQueryBuilder("vesting");

    queryBuilder.select();
    queryBuilder.andWhere("vesting.contractModule = :contractModule", {
      contractModule: ModuleType.VESTING,
    });

    if (contractTemplate) {
      if (contractTemplate.length === 1) {
        queryBuilder.andWhere(":contractFeature = ANY(vesting.contractFeatures)", {
          contractFeature: contractTemplate[0],
        });
      } else {
        queryBuilder.andWhere("vesting.contractFeatures && :contractFeatures", { contractFeatures: contractTemplate });
      }
    }

    if (account) {
      queryBuilder.andWhere(`vesting.parameters->>'account' = :account`, {
        account,
      });
    }

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    queryBuilder.orderBy({
      "vesting.createdAt": "DESC",
    });

    return queryBuilder.getManyAndCount();
  }

  public findOne(
    where: FindOptionsWhere<ContractEntity>,
    options?: FindOneOptions<ContractEntity>,
  ): Promise<ContractEntity | null> {
    return this.contractEntityRepository.findOne({ where, ...options });
  }
}
