import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindManyOptions, FindOneOptions, FindOptionsWhere, IsNull, Repository } from "typeorm";

import { ModuleType, TokenType } from "@framework/types";

import { UserEntity } from "../user/user.entity";
import { RatePlanEntity } from "./rate-plan.entity";

@Injectable()
export class RatePlanService {
  constructor(
    @InjectRepository(RatePlanEntity)
    private readonly ratePlanEntityRepository: Repository<RatePlanEntity>,
  ) {}

  public findAll(
    where: FindOptionsWhere<RatePlanEntity>,
    options?: FindManyOptions<RatePlanEntity>,
  ): Promise<[Array<RatePlanEntity>, number]> {
    return this.ratePlanEntityRepository.findAndCount({ where, ...options });
  }

  public findOne(
    where: FindOptionsWhere<RatePlanEntity>,
    options?: FindOneOptions<RatePlanEntity>,
  ): Promise<RatePlanEntity | null> {
    return this.ratePlanEntityRepository.findOne({ where, ...options });
  }

  public async getPlanLimits(
    userEntity: UserEntity,
    contractModule: ModuleType,
    contractType: TokenType | null,
  ): Promise<number> {
    return this.findOne({
      contractModule,
      contractType: contractType || IsNull(),
      ratePlan: userEntity.merchant.ratePlan,
    }).then(rateLimitEntity => {
      if (!rateLimitEntity) {
        return 0;
      }
      return rateLimitEntity.amount;
    });
  }
}
