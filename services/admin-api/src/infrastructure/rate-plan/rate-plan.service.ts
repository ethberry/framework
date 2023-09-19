import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, IsNull, Repository } from "typeorm";

import { ModuleType, TokenType } from "@framework/types";

import { UserEntity } from "../user/user.entity";
import { RatePlanEntity } from "./rate-plan.entity";

@Injectable()
export class RatePlanService {
  constructor(
    @InjectRepository(RatePlanEntity)
    private readonly stakingDepositEntityRepository: Repository<RatePlanEntity>,
  ) {}

  public findOne(
    where: FindOptionsWhere<RatePlanEntity>,
    options?: FindOneOptions<RatePlanEntity>,
  ): Promise<RatePlanEntity | null> {
    return this.stakingDepositEntityRepository.findOne({ where, ...options });
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
      if (userEntity.merchantId === 1) {
        // TODO get it from settings
        return 1e6;
      }
      if (!rateLimitEntity) {
        return 0;
      }
      return rateLimitEntity.amount;
    });
  }
}
