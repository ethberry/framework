import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, IsNull, Repository } from "typeorm";

import { PaymentRequiredException } from "@gemunion/nest-js-utils";
import { BusinessType, ModuleType, TokenType } from "@framework/types";

import { UserEntity } from "../../infrastructure/user/user.entity";
import { RatePlanService } from "../../infrastructure/rate-plan/rate-plan.service";
import { ContractService } from "../hierarchy/contract/contract.service";
import { ContractManagerEntity } from "./contract-manager.entity";

@Injectable()
export class ContractManagerService {
  constructor(
    @InjectRepository(ContractManagerEntity)
    private readonly contractManagerEntityRepository: Repository<ContractManagerEntity>,
    private readonly planService: RatePlanService,
    private readonly contractService: ContractService,
    protected readonly configService: ConfigService,
  ) {}

  public findOne(
    where: FindOptionsWhere<ContractManagerEntity>,
    options?: FindOneOptions<ContractManagerEntity>,
  ): Promise<ContractManagerEntity | null> {
    return this.contractManagerEntityRepository.findOne({ where, ...options });
  }

  public async validateDeployment(
    userEntity: UserEntity,
    contractModule: ModuleType,
    contractType: TokenType | null,
  ): Promise<void> {
    const businessType = this.configService.get<BusinessType>("BUSINESS_TYPE", BusinessType.B2B);

    if (businessType === BusinessType.B2B) {
      const limit = await this.planService.getPlanLimits(userEntity, contractModule, contractType);
      const count = await this.contractService.count({
        contractModule,
        contractType: contractType || IsNull(),
        merchantId: userEntity.merchantId,
      });

      if (count >= limit) {
        throw new PaymentRequiredException("paymentRequired");
      }
    }
  }
}
