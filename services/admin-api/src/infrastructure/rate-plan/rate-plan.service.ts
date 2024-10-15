import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { FindManyOptions, FindOneOptions, FindOptionsWhere, IsNull, Repository } from "typeorm";

import { PaymentRequiredException } from "@ethberry/nest-js-utils";
import { BusinessType, ModuleType, TokenType } from "@framework/types";

import { UserEntity } from "../user/user.entity";
import { RatePlanEntity } from "./rate-plan.entity";
import { ContractService } from "../../blockchain/hierarchy/contract/contract.service";

@Injectable()
export class RatePlanService {
  constructor(
    @InjectRepository(RatePlanEntity)
    private readonly ratePlanEntityRepository: Repository<RatePlanEntity>,
    protected readonly configService: ConfigService,
    private readonly contractService: ContractService,
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

  public async validateDeployment(
    userEntity: UserEntity,
    contractModule: ModuleType,
    contractType: TokenType | null,
  ): Promise<void> {
    const businessType = this.configService.get<BusinessType>("BUSINESS_TYPE", BusinessType.B2B);

    if (businessType === BusinessType.B2B) {
      const limit = await this.getPlanLimits(userEntity, contractModule, contractType);
      const count = await this.contractService.count({
        contractModule,
        contractType: contractType || IsNull(),
        merchantId: userEntity.merchantId,
      });

      if (limit && count >= limit) {
        throw new PaymentRequiredException("paymentRequired");
      }
    }
  }
}
