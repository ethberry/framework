import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { IVestingSearchDto } from "@framework/types";

import { VestingEntity } from "./vesting.entity";

@Injectable()
export class VestingService {
  constructor(
    @InjectRepository(VestingEntity)
    private readonly vestingEntityRepository: Repository<VestingEntity>,
  ) {}

  public async search(dto: IVestingSearchDto): Promise<[Array<VestingEntity>, number]> {
    const { query, contractTemplate, skip, take } = dto;

    const queryBuilder = this.vestingEntityRepository.createQueryBuilder("vesting");

    queryBuilder.select();

    if (contractTemplate) {
      if (contractTemplate.length === 1) {
        queryBuilder.andWhere("vesting.contractTemplate = :contractTemplate", {
          contractTemplate: contractTemplate[0],
        });
      } else {
        queryBuilder.andWhere("vesting.contractTemplate IN(:...contractTemplate)", { contractTemplate });
      }
    }

    if (query) {
      queryBuilder.andWhere("vesting.account = :account", { account: query });
    }

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    queryBuilder.orderBy({
      "vesting.createdAt": "DESC",
    });

    return queryBuilder.getManyAndCount();
  }

  public findOne(
    where: FindOptionsWhere<VestingEntity>,
    options?: FindOneOptions<VestingEntity>,
  ): Promise<VestingEntity | null> {
    return this.vestingEntityRepository.findOne({ where, ...options });
  }
}
