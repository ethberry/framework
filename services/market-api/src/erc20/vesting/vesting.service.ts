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
    const { query, vestingTemplate, skip, take } = dto;

    const queryBuilder = this.erc20VestingEntityRepository.createQueryBuilder("vesting");

    queryBuilder.leftJoinAndSelect("vesting.erc20Token", "token");

    queryBuilder.select();

    if (vestingTemplate) {
      if (vestingTemplate.length === 1) {
        queryBuilder.andWhere("vesting.vestingTemplate = :vestingTemplate", { vestingTemplate: vestingTemplate[0] });
      } else {
        queryBuilder.andWhere("vesting.vestingTemplate IN(:...vestingTemplate)", { vestingTemplate });
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
