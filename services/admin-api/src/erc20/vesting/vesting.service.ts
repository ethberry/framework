import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { IErc20VestingSearchDto } from "@framework/types";

import { Erc20VestingEntity } from "./vesting.entity";

@Injectable()
export class Erc20VestingService {
  constructor(
    @InjectRepository(Erc20VestingEntity)
    private readonly erc20VestingEntityRepository: Repository<Erc20VestingEntity>,
  ) {}

  public async search(dto: IErc20VestingSearchDto): Promise<[Array<Erc20VestingEntity>, number]> {
    const { query, vestingType, erc20TokenIds, skip, take } = dto;

    const queryBuilder = this.erc20VestingEntityRepository.createQueryBuilder("vesting");

    queryBuilder.leftJoinAndSelect("vesting.erc20Token", "token");

    queryBuilder.select();

    if (vestingType) {
      if (vestingType.length === 1) {
        queryBuilder.andWhere("vesting.vestingType = :vestingType", { vestingType: vestingType[0] });
      } else {
        queryBuilder.andWhere("vesting.vestingType IN(:...vestingType)", { vestingType });
      }
    }

    if (erc20TokenIds) {
      if (erc20TokenIds.length === 1) {
        queryBuilder.andWhere("vesting.erc20TokenId = :erc20TokenId", {
          erc20TokenId: erc20TokenIds[0],
        });
      } else {
        queryBuilder.andWhere("vesting.erc20TokenId IN(:...erc20TokenIds)", { erc20TokenIds });
      }
    }

    if (query) {
      queryBuilder.andWhere("vesting.beneficiary = :beneficiary", { query });
    }

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    queryBuilder.orderBy({
      "vesting.createdAt": "DESC",
    });

    return queryBuilder.getManyAndCount();
  }

  public findOne(
    where: FindOptionsWhere<Erc20VestingEntity>,
    options?: FindOneOptions<Erc20VestingEntity>,
  ): Promise<Erc20VestingEntity | null> {
    return this.erc20VestingEntityRepository.findOne({ where, ...options });
  }
}
