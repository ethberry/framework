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
    const merchantEntity = await this.merchantService.findOne({ id: userEntity.merchantId });

    if (!merchantEntity) {
      throw new NotFoundException("merchantNotFound");
    }

    return this.findOne({
      contractModule,
      contractType: contractType || IsNull(),
      ratePlan: merchantEntity.ratePlan,
    }).then(rateLimitEntity => {
      if (!rateLimitEntity) {
        return 0;
      }
      return rateLimitEntity.amount;
    });
  }
}
