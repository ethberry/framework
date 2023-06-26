import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, IsNull, Repository } from "typeorm";

import { ModuleType, TokenType } from "@framework/types";

import { UserEntity } from "../user/user.entity";
import { MerchantService } from "../merchant/merchant.service";
import { RatePlanEntity } from "./plan.entity";

@Injectable()
export class RatePlanService {
  constructor(
    @InjectRepository(RatePlanEntity)
    private readonly stakingDepositEntityRepository: Repository<RatePlanEntity>,
    private readonly merchantService: MerchantService,
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
        return 0;
      }
      if (!rateLimitEntity) {
        return 0;
      }
      return rateLimitEntity.amount;
    });
  }
}
